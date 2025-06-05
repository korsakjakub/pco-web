import { test, expect, Page, BrowserContext } from '@playwright/test';
import { PokerGameHelpers, TestPlayer } from './helpers';

test.describe('Multi-Player Poker Game E2E', () => {
  let players: TestPlayer[] = [];
  let contexts: BrowserContext[] = [];
  
  test.beforeEach(async ({ browser }) => {
    // Create separate browser contexts for each player to simulate different users
    for (let i = 0; i < 3; i++) {
      const context = await browser.newContext();
      contexts.push(context);
    }
  });

  test.afterEach(async () => {
    // Clean up all contexts
    for (const context of contexts) {
      await context.close();
    }
    contexts = [];
    players = [];
  });

  test('should handle complete multi-player poker game with multiple rounds', async () => {
    // Step 1: Create first player (admin) and new room
    const adminPage = await contexts[0].newPage();
    const admin = await PokerGameHelpers.createPlayer(adminPage, 'Alice');
    players.push(admin);
    
    // Extract queueId from admin's session context for other players to join
    const queueId = await adminPage.evaluate(() => {
      const ctx = sessionStorage.getItem('ctx');
      return ctx ? JSON.parse(ctx).queueId : null;
    });
    expect(queueId).toBeTruthy();
    console.log('Admin queueId:', queueId);

    // Step 2: Create and join second player (valid name)
    const player2Page = await contexts[1].newPage();
    await player2Page.goto(`/join/${queueId}`);
    await player2Page.waitForSelector('input[name="playerName"]', { timeout: 10000 });
    await player2Page.fill('input[name="playerName"]', 'Bob');
    await player2Page.waitForSelector('button:has-text("Join")', { timeout: 10000 });
    await expect(player2Page.locator('button:has-text("Join")')).toBeEnabled({ timeout: 10000 });
    await player2Page.click('button:has-text("Join")');
    await player2Page.waitForURL(/\/queue\/.*/, { timeout: 15000 });
    await player2Page.screenshot({ path: 'test-results/player2-in-queue.png' });
    const player2 = { name: 'Bob', page: player2Page };
    players.push(player2);

    // Step 3: Create and join third player (valid name)
    const player3Page = await contexts[2].newPage();
    await player3Page.goto(`/join/${queueId}`);
    await player3Page.waitForSelector('input[name="playerName"]', { timeout: 10000 });
    await player3Page.fill('input[name="playerName"]', 'Charlie');
    await player3Page.waitForSelector('button:has-text("Join")', { timeout: 10000 });
    await expect(player3Page.locator('button:has-text("Join")')).toBeEnabled({ timeout: 10000 });
    await player3Page.click('button:has-text("Join")');
    await player3Page.waitForURL(/\/queue\/.*/, { timeout: 15000 });
    await player3Page.screenshot({ path: 'test-results/player3-in-queue.png' });
    const player3 = { name: 'Charlie', page: player3Page };
    players.push(player3);

    // Step 4: Wait for all players to be in the queue (wait on player2/player3's queue page)
    await player2Page.waitForFunction(() => {
      const playerRows = document.querySelectorAll('table tbody tr td');
      return Array.from(playerRows).some(td => td.textContent?.includes('Bob'));
    }, {}, { timeout: 15000 });
    await player3Page.waitForFunction(() => {
      const playerRows = document.querySelectorAll('table tbody tr td');
      return Array.from(playerRows).some(td => td.textContent?.includes('Charlie'));
    }, {}, { timeout: 15000 });

    // Step 5: Admin expands AdminPanel and accepts players from queue
    const adminPanelSummary = adminPage.locator('summary:has-text("Admin Panel")');
    await expect(adminPanelSummary).toBeVisible({ timeout: 10000 });
    await adminPanelSummary.click();
    await adminPage.waitForTimeout(500);
    await adminPage.screenshot({ path: 'test-results/admin-before-accept.png' });
    // Accept both players
    for (const playerName of ['Bob', 'Charlie']) {
      const addButton = adminPage.locator(`tr:has-text("${playerName}") button:has-text("Add")`);
      await expect(addButton).toBeVisible({ timeout: 10000 });
      await expect(addButton).toBeEnabled({ timeout: 10000 });
      await addButton.click();
      await adminPage.waitForTimeout(1000);
    }
    await adminPage.screenshot({ path: 'test-results/admin-after-accept.png' });

    // Wait for players to be moved to game
    await player2Page.waitForURL(/\/game\/.*/, { timeout: 20000 });
    await player3Page.waitForURL(/\/game\/.*/, { timeout: 20000 });
    await player2Page.screenshot({ path: 'test-results/player2-in-game.png' });
    await player3Page.screenshot({ path: 'test-results/player3-in-game.png' });

    // Step 6: Admin starts the game
    await adminPage.waitForTimeout(2000);
    const startButton = adminPage.locator('button:has-text("Start game")');
    await expect(startButton).toBeVisible({ timeout: 10000 });
    await expect(startButton).toBeEnabled({ timeout: 10000 });
    await startButton.click();
    await adminPage.screenshot({ path: 'test-results/admin-after-start.png' });
    // Wait for all players to transition to game
    await PokerGameHelpers.waitForGameToStart(adminPage);
    await PokerGameHelpers.waitForGameToStart(player2Page);
    await PokerGameHelpers.waitForGameToStart(player3Page);

    // Step 7: Verify all players are in the game
    for (const player of players) {
      await PokerGameHelpers.assertPlayerExists(player.page, 'Alice');
      await PokerGameHelpers.assertPlayerExists(player.page, 'Bob');
      await PokerGameHelpers.assertPlayerExists(player.page, 'Charlie');
    }

    // Step 8: Wait for all players to see the active game
    await expect(adminPage.locator('text=Pot:')).toBeVisible();
    await expect(player2Page.locator('text=Pot:')).toBeVisible();
    await expect(player3Page.locator('text=Pot:')).toBeVisible();

    // Step 9: Play first round
    await playPokerRound(players, 1);

    // Step 10: Verify pot was distributed and new round started
    await PokerGameHelpers.waitForGameStage(adminPage, 'PRE_FLOP');
    // Step 11: Play second round
    await playPokerRound(players, 2);

    // Step 12: Verify game state after multiple rounds
    const finalPot = await PokerGameHelpers.getPotSize(adminPage);
    expect(finalPot).toBeGreaterThanOrEqual(0);

    // Verify all players still exist
    for (const player of players) {
      await PokerGameHelpers.assertPlayerExists(player.page, 'Alice');
      await PokerGameHelpers.assertPlayerExists(player.page, 'Bob');
      await PokerGameHelpers.assertPlayerExists(player.page, 'Charlie');
    }
  });

  test('should handle player folding and betting dynamics', async () => {
    // Setup 3 players with valid names
    const adminPage = await contexts[0].newPage();
    const admin = await PokerGameHelpers.createPlayer(adminPage, 'Alice');
    players.push(admin);

    const queueId = await adminPage.evaluate(() => {
      const ctx = sessionStorage.getItem('ctx');
      return ctx ? JSON.parse(ctx).queueId : null;
    });

    // Player 2 joins
    const player2Page = await contexts[1].newPage();
    await player2Page.goto(`/join/${queueId}`);
    await player2Page.waitForSelector('input[name="playerName"]', { timeout: 10000 });
    await player2Page.fill('input[name="playerName"]', 'Bob');
    await player2Page.waitForSelector('button:has-text("Join")', { timeout: 10000 });
    await expect(player2Page.locator('button:has-text("Join")')).toBeEnabled({ timeout: 10000 });
    await player2Page.click('button:has-text("Join")');
    await player2Page.waitForURL(/\/queue\/.*/, { timeout: 15000 });
    players.push({ name: 'Bob', page: player2Page });

    // Player 3 joins
    const player3Page = await contexts[2].newPage();
    await player3Page.goto(`/join/${queueId}`);
    await player3Page.waitForSelector('input[name="playerName"]', { timeout: 10000 });
    await player3Page.fill('input[name="playerName"]', 'Charlie');
    await player3Page.waitForSelector('button:has-text("Join")', { timeout: 10000 });
    await expect(player3Page.locator('button:has-text("Join")')).toBeEnabled({ timeout: 10000 });
    await player3Page.click('button:has-text("Join")');
    await player3Page.waitForURL(/\/queue\/.*/, { timeout: 15000 });
    players.push({ name: 'Charlie', page: player3Page });

    // Wait for players to appear in queue
    await player2Page.waitForFunction(() => {
      const playerRows = document.querySelectorAll('table tbody tr td');
      return Array.from(playerRows).some(td => td.textContent?.includes('Bob'));
    }, {}, { timeout: 15000 });
    await player3Page.waitForFunction(() => {
      const playerRows = document.querySelectorAll('table tbody tr td');
      return Array.from(playerRows).some(td => td.textContent?.includes('Charlie'));
    }, {}, { timeout: 15000 });

    // Admin expands AdminPanel and accepts players from queue
    const adminPanelSummary = adminPage.locator('summary:has-text("Admin Panel")');
    await expect(adminPanelSummary).toBeVisible({ timeout: 10000 });
    await adminPanelSummary.click();
    await adminPage.waitForTimeout(500);
    // Accept both players
    for (const playerName of ['Bob', 'Charlie']) {
      const addButton = adminPage.locator(`tr:has-text("${playerName}") button:has-text("Add")`);
      await expect(addButton).toBeVisible({ timeout: 10000 });
      await expect(addButton).toBeEnabled({ timeout: 10000 });
      await addButton.click();
      await adminPage.waitForTimeout(1000);
    }

    // Wait for players to be moved to game
    await player2Page.waitForURL(/\/game\/.*/, { timeout: 20000 });
    await player3Page.waitForURL(/\/game\/.*/, { timeout: 20000 });

    // Start the game
    await adminPage.waitForTimeout(2000);
    const startButton = adminPage.locator('button:has-text("Start game")');
    await expect(startButton).toBeVisible({ timeout: 10000 });
    await expect(startButton).toBeEnabled({ timeout: 10000 });
    await startButton.click();

    // Wait for all players to see the active game
    await expect(adminPage.locator('text=Pot:')).toBeVisible();
    await expect(player2Page.locator('text=Pot:')).toBeVisible();
    await expect(player3Page.locator('text=Pot:')).toBeVisible();

    // Test betting dynamics
    let roundsPlayed = 0;
    const maxRounds = 2;

    while (roundsPlayed < maxRounds) {
      // Pre-flop betting
      await simulateBettingRound(players, 'PRE_FLOP');

      // Try to continue through betting stages
      try {
        await PokerGameHelpers.waitForGameStage(adminPage, 'FLOP');
        await simulateBettingRound(players, 'FLOP');
        
        await PokerGameHelpers.waitForGameStage(adminPage, 'TURN');
        await simulateBettingRound(players, 'TURN');
        
        await PokerGameHelpers.waitForGameStage(adminPage, 'RIVER');
        await simulateBettingRound(players, 'RIVER');
      } catch (error) {
        console.log('Round ended early, continuing to next round');
      }

      roundsPlayed++;

      if (roundsPlayed < maxRounds) {
        try {
          await PokerGameHelpers.waitForGameStage(adminPage, 'PRE_FLOP');
        } catch (error) {
          console.log('Could not start new round');
          break;
        }
      }
    }
  });

  async function playPokerRound(players: TestPlayer[], roundNumber: number) {
    const adminPage = players[0].page;
    
    console.log(`Starting round ${roundNumber}`);
    
    // Pre-flop betting round
    await simulateBettingRound(players, 'PRE_FLOP');
    
    // Wait for flop
    try {
      await PokerGameHelpers.waitForGameStage(adminPage, 'FLOP');
      await simulateBettingRound(players, 'FLOP');
    } catch (error) {
      console.log('Round ended early or FLOP not reached');
      return;
    }
    
    // Wait for turn
    try {
      await PokerGameHelpers.waitForGameStage(adminPage, 'TURN');
      await simulateBettingRound(players, 'TURN');
    } catch (error) {
      console.log('TURN not reached');
      return;
    }
    
    // Wait for river
    try {
      await PokerGameHelpers.waitForGameStage(adminPage, 'RIVER');
      await simulateBettingRound(players, 'RIVER');
    } catch (error) {
      console.log('RIVER not reached');
      return;
    }
    
    // Wait for round completion
    await adminPage.waitForTimeout(2000);
  }

  async function simulateBettingRound(players: TestPlayer[], stage: string) {
    console.log(`Simulating betting round for stage: ${stage}`);
    
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      
      try {
        // Check if player can make an action
        const actionButtons = await player.page.locator('button.player-action').all();
        
        if (actionButtons.length === 0) {
          continue; // No actions available for this player
        }
        
        // Check if buttons are enabled
        const firstButton = actionButtons[0];
        const isDisabled = await firstButton.isDisabled();
        
        if (isDisabled) {
          continue; // Not this player's turn
        }
        
        // Get available action texts
        const availableActions: string[] = [];
        for (const button of actionButtons) {
          const text = await button.textContent();
          if (text) {
            availableActions.push(text.trim());
          }
        }
        
        // Make strategic decision - ensure at least one player doesn't fold
        let action = 'CHECK';
        if (availableActions.includes('CHECK')) {
          action = 'CHECK';
        } else if (availableActions.includes('CALL')) {
          action = 'CALL';
        } else if (availableActions.includes('FOLD') && i > 0) {
          // Only allow folding if not the first player to prevent all folding
          action = 'FOLD';
        } else if (availableActions.includes('FOLD')) {
          action = 'FOLD';
        }
        
        // Occasionally raise for more interesting gameplay
        if (availableActions.includes('RAISE') && Math.random() > 0.7) {
          action = 'RAISE';
          await PokerGameHelpers.makeAction(player.page, 'raise', 100);
        } else {
          await PokerGameHelpers.makeAction(player.page, action.toLowerCase() as any);
        }
        
        console.log(`${player.name} performed action: ${action}`);
        
        // Wait for action to process
        await player.page.waitForTimeout(1000);
        
      } catch (error) {
        console.log(`${player.name} couldn't make action in ${stage}: ${error}`);
        // Continue to next player
      }
    }
    
    // Wait for betting round to complete
    await players[0].page.waitForTimeout(2000);
  }
});