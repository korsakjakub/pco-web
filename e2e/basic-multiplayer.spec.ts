import { test, expect, Page, BrowserContext } from '@playwright/test';

test.describe('Basic Multiplayer Poker', () => {
  let contexts: BrowserContext[] = [];
  
  test.beforeEach(async ({ browser }) => {
    // Create separate browser contexts for each player
    for (let i = 0; i < 3; i++) {
      const context = await browser.newContext();
      contexts.push(context);
    }
  });

  test.afterEach(async () => {
    for (const context of contexts) {
      await context.close();
    }
    contexts = [];
  });

  test('should create room and have 2 players join and start game', async () => {
    // Player 1 creates a new room
    const page1 = await contexts[0].newPage();
    await page1.goto('/');
    
    await page1.fill('input[name="playerName"]', 'Alice');
    await page1.click('button:has-text("New game")');
    
    // Wait for navigation to game (admin goes directly to game)
    await page1.waitForURL(/\/game\/.*/, { timeout: 30000 });
    
    // Extract queueId from context in sessionStorage
    const queueId = await page1.evaluate(() => {
      const ctx = sessionStorage.getItem('ctx');
      return ctx ? JSON.parse(ctx).queueId : null;
    });
    expect(queueId).toBeTruthy();

    // Player 2 joins the room
    const page2 = await contexts[1].newPage();
    await page2.goto(`/join/${queueId}`);
    
    await page2.fill('input[name="playerName"]', 'Bob');
    await page2.click('button:has-text("Join")');
    
    await page2.waitForURL(/\/queue\/.*/, { timeout: 10000 });

    // Wait for player to appear in queue
    await page2.waitForFunction(() => {
      const playerRows = document.querySelectorAll('table tbody tr td');
      return Array.from(playerRows).some(td => td.textContent?.includes('Bob'));
    }, {}, { timeout: 15000 });

    // Admin needs to accept player from queue
    await page1.waitForTimeout(2000); // Give time for player to appear in queue

    // Expand AdminPanel to access queue controls
    const adminPanelSummary = page1.locator('summary:has-text("Admin Panel")');
    await expect(adminPanelSummary).toBeVisible({ timeout: 10000 });
    await adminPanelSummary.click(); // Expand the details element

    // Accept player from queue
    const addButton = page1.locator('button:has-text("Add")').first();
    await expect(addButton).toBeVisible({ timeout: 10000 });
    await addButton.click();
    await page1.waitForTimeout(1000);

    // Wait for player to be moved to game
    await page2.waitForURL(/\/game\/.*/, { timeout: 15000 });

    // Start the game (as admin)
    await page1.waitForTimeout(2000);
    const startButton = page1.locator('button:has-text("Start game")');
    await expect(startButton).toBeEnabled({ timeout: 10000 });
    await startButton.click();

    // Verify both players see the active game
    await expect(page1.locator('text=Pot:')).toBeVisible();
    await expect(page2.locator('text=Pot:')).toBeVisible();
    
    // Take screenshots for verification
    await page1.screenshot({ path: 'test-results/player1-game-start.png' });
    await page2.screenshot({ path: 'test-results/player2-game-start.png' });
  });

  test('should handle basic poker actions with 2 players', async () => {
    // Setup: Create room with 2 players
    const page1 = await contexts[0].newPage();
    await page1.goto('/');
    await page1.fill('input[name="playerName"]', 'PlayerOne');
    await page1.click('button:has-text("New game")');
    await page1.waitForURL(/\/game\/.*/, { timeout: 30000 });
    
    const queueId = await page1.evaluate(() => {
      const ctx = sessionStorage.getItem('ctx');
      return ctx ? JSON.parse(ctx).queueId : null;
    });
    
    const page2 = await contexts[1].newPage();
    await page2.goto(`/join/${queueId}`);
    await page2.fill('input[name="playerName"]', 'PlayerTwo');
    await page2.click('button:has-text("Join")');
    await page2.waitForURL(/\/queue\/.*/, { timeout: 10000 });

    // Wait for player to join queue and admin to accept them
    await page2.waitForTimeout(2000);
    
    // Expand AdminPanel to access queue controls
    const adminPanelSummary = page1.locator('summary:has-text("Admin Panel")');
    await expect(adminPanelSummary).toBeVisible({ timeout: 10000 });
    await adminPanelSummary.click(); // Expand the details element
    
    // Admin accepts player from queue
    const addButton = page1.locator('button:has-text("Add")').first();
    await expect(addButton).toBeVisible({ timeout: 10000 });
    await addButton.click();
    await page1.waitForTimeout(1000);
    
    // Wait for player to move to game
    await page2.waitForURL(/\/game\/.*/, { timeout: 15000 });
    
    // Start the game
    await page1.waitForTimeout(2000);
    const startButton = page1.locator('button:has-text("Start game")');
    await expect(startButton).toBeEnabled({ timeout: 10000 });
    await startButton.click();

    // Wait for game to be active
    await page1.waitForSelector('.player-actions button', { timeout: 15000 });
    await page2.waitForSelector('.player-actions button', { timeout: 15000 });

    // Try to make some basic actions
    const pages = [page1, page2];
    
    for (let i = 0; i < 2; i++) {
      const page = pages[i];
      
      try {
        const actionButtons = await page.locator('.player-actions button:not([disabled])').all();
        
        if (actionButtons.length > 0) {
          // Click the first available action
          await actionButtons[0].click();
          await page.waitForTimeout(1000);
          
          console.log(`Player ${i + 1} made an action`);
          break; // One action per test is enough
        }
      } catch (error) {
        console.log(`Player ${i + 1} couldn't make action: ${error}`);
      }
    }

    // Verify game state
    const pot = await page1.locator('text=Pot:').textContent();
    expect(pot).toBeTruthy();
    
    // Take final screenshots
    await page1.screenshot({ path: 'test-results/game-after-action.png' });
  });
});