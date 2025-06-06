import { Page, expect } from '@playwright/test';

export interface TestPlayer {
  name: string;
  page: Page;
  context?: any;
}

export class PokerGameHelpers {
  static async createPlayer(page: Page, playerName: string): Promise<TestPlayer> {
    await page.goto('/');
    
    // Fill in player name
    await page.fill('input[name="playerName"]', playerName);
    
    // Create new room as admin
    await page.click('button:has-text("New game")');
    
    // Wait for navigation to queue or game
    await page.waitForURL(/\/(queue|game)\/.*/, { timeout: 30000 });
    
    return {
      name: playerName,
      page: page,
    };
  }

  static async joinExistingRoom(page: Page, playerName: string, queueId: string): Promise<TestPlayer> {
    await page.goto(`/join/${queueId}`);
    
    // Fill in player name
    await page.fill('input[name="playerName"]', playerName);
    
    // Join the room
    await page.click('button:has-text("Join")');
    
    // Wait for navigation to queue or game
    await page.waitForURL(/\/(queue|game)\/.*/, { timeout: 10000 });
    
    return {
      name: playerName,
      page: page,
    };
  }

  static async waitForGameToStart(page: Page): Promise<void> {
    // Wait for game to start by checking if player actions are available or if there's a pot display
    try {
      await page.waitForSelector('.player-actions button.player-action', { 
        timeout: 10000 
      });
    } catch {
      // If no actions available, just verify the game interface is loaded
      await page.waitForSelector('.game-info', { timeout: 10000 });
    }
  }

  static async waitForPlayerTurn(page: Page, playerName: string): Promise<void> {
    // Wait for it to be this player's turn by checking if actions are enabled
    await page.waitForFunction(() => {
      const actionButtons = document.querySelectorAll('.player-actions button.player-action');
      return actionButtons.length > 0 && !actionButtons[0].disabled;
    }, {}, { timeout: 30000 });
  }

  static async makeAction(page: Page, action: 'fold' | 'call' | 'raise' | 'check' | 'bet', amount?: number): Promise<void> {
    const actionSelector = `button.player-action:has-text("${action.toUpperCase()}")`;
    
    // Wait for action button to be available
    await page.waitForSelector(actionSelector, { timeout: 10000 });
    
    if ((action === 'raise' || action === 'bet') && amount) {
      // Fill in raise/bet amount if provided
      await page.fill('.player-actions input[type="number"]', amount.toString());
    }
    
    // Click the action button
    await page.click(actionSelector);
    
    // Wait for action to be processed
    await page.waitForTimeout(1000);
  }

  static async getPlayerChips(page: Page, playerName: string): Promise<number> {
    // Find player by name and get their chips
    const playerElement = await page.locator(`.player-name:has-text("${playerName}")`).locator('..').locator('.player-frame-chips');
    const chipsText = await playerElement.textContent();
    return parseInt(chipsText?.replace(/[^0-9]/g, '') || '0');
  }

  static async getGameStage(page: Page): Promise<string> {
    // Count cards on table to determine stage
    const cardCount = await page.locator('.game-stage .table-card').count();
    switch (cardCount) {
      case 0: return 'PRE_FLOP';
      case 3: return 'FLOP';
      case 4: return 'TURN';
      case 5: return 'RIVER';
      default: return 'PRE_FLOP';
    }
  }

  static async getPotSize(page: Page): Promise<number> {
    const potElement = await page.locator('.game-info .staked-chips');
    const potText = await potElement.textContent();
    return parseInt(potText?.replace(/[^0-9]/g, '') || '0');
  }

  static async waitForGameStage(page: Page, stage: string): Promise<void> {
    await page.waitForFunction((expectedStage) => {
      const cardCount = document.querySelectorAll('.game-stage .table-card').length;
      let currentStage;
      switch (cardCount) {
        case 0: currentStage = 'PRE_FLOP'; break;
        case 3: currentStage = 'FLOP'; break;
        case 4: currentStage = 'TURN'; break;
        case 5: currentStage = 'RIVER'; break;
        default: currentStage = 'PRE_FLOP';
      }
      return currentStage === expectedStage;
    }, stage, { timeout: 20000 });
  }

  static async waitForRoundToComplete(page: Page): Promise<void> {
    // Wait for showdown stage
    await this.waitForGameStage(page, 'SHOWDOWN');
    
    // Wait for new round to start (back to PRE_FLOP)
    await page.waitForTimeout(3000); // Give time for showdown animation
    await this.waitForGameStage(page, 'PRE_FLOP');
  }

  static async assertPlayerExists(page: Page, playerName: string): Promise<void> {
    await expect(page.locator(`.player-name:has-text("${playerName}")`)).toBeVisible();
  }

  static async assertMinimumPlayers(page: Page, minPlayers: number): Promise<void> {
    await page.waitForFunction(
      (min) => document.querySelectorAll('.player-name').length >= min,
      minPlayers,
      { timeout: 10000 }
    );
  }

  static async startGameAsAdmin(page: Page): Promise<void> {
    // Look for and click start game button (admin only)
    const startButton = page.locator('button:has-text("Start Game")');
    if (await startButton.isVisible()) {
      await startButton.click();
      await this.waitForGameToStart(page);
    }
  }

  static async extractRoomIdFromUrl(page: Page): Promise<string> {
    const url = page.url();
    const match = url.match(/\/(queue|game)\/([^/]+)/);
    return match ? match[2] : '';
  }

  static async skipToPlayerAction(page: Page, targetPlayerName: string): Promise<void> {
    // Keep making actions until it's the target player's turn
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      try {
        // Check if actions are available (meaning it's someone's turn)
        const availableActions = await page.locator('button.player-action');
        if (await availableActions.first().isVisible() && !await availableActions.first().isDisabled()) {
          // Make a simple action to advance the turn
          if (await page.locator('button.player-action:has-text("FOLD")').isVisible()) {
            await page.click('button.player-action:has-text("FOLD")');
          } else if (await page.locator('button.player-action:has-text("CHECK")').isVisible()) {
            await page.click('button.player-action:has-text("CHECK")');
          } else if (await page.locator('button.player-action:has-text("CALL")').isVisible()) {
            await page.click('button.player-action:has-text("CALL")');
          }
        }
        
        await page.waitForTimeout(1000);
        attempts++;
      } catch (error) {
        attempts++;
        await page.waitForTimeout(1000);
      }
    }
  }

  static async waitForElementWithText(page: Page, selector: string, text: string, timeout = 10000): Promise<void> {
    await page.waitForSelector(`${selector}:has-text("${text}")`, { timeout });
  }

  static async getAllPlayerNames(page: Page): Promise<string[]> {
    const playerElements = await page.locator('.player-name').all();
    const names: string[] = [];
    
    for (const element of playerElements) {
      const name = await element.textContent();
      if (name) {
        names.push(name.trim());
      }
    }
    
    return names;
  }

  static async takeScreenshot(page: Page, name: string): Promise<void> {
    await page.screenshot({ 
      path: `test-results/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }
}