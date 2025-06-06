import { test, expect } from '@playwright/test';

test.describe('Simple Two-Player Game', () => {
  test('should create a game with 2 players and start playing', async ({ browser }) => {
    // Create two browser contexts for two different players
    const adminContext = await browser.newContext();
    const playerContext = await browser.newContext();
    
    try {
      // Step 1: Admin creates a new game
      const adminPage = await adminContext.newPage();
      await adminPage.goto('/');
      await adminPage.fill('input[name="playerName"]', 'AdminPlayer');
      await adminPage.click('button:has-text("New game")');
      await adminPage.waitForURL(/\/game\/.*/, { timeout: 10000 });
      
      // Step 2: Extract queueId from admin's context
      const queueId = await adminPage.evaluate(() => {
        const ctx = sessionStorage.getItem('ctx');
        return ctx ? JSON.parse(ctx).queueId : null;
      });
      expect(queueId).toBeTruthy();
      console.log('Queue ID:', queueId);
      
      // Step 3: Second player joins the queue
      const playerPage = await playerContext.newPage();
      await playerPage.goto(`/join/${queueId}`);
      await expect(playerPage.locator('h1')).toContainText('Join Room');
      
      await playerPage.fill('input[name="playerName"]', 'SecondPlayer');
      await playerPage.click('button:has-text("Join")');
      await playerPage.waitForURL(/\/queue\/.*/, { timeout: 10000 });
      
      // Step 4: Verify player is in queue
      await playerPage.waitForFunction(() => {
        return document.querySelector('table tbody')?.textContent?.includes('SecondPlayer') || false;
      }, {}, { timeout: 10000 });
      
      // Step 5: Admin expands the AdminPanel to see queue controls
      await adminPage.waitForTimeout(2000); // Give time for player to appear in admin's queue view
      
      const adminPanelSummary = adminPage.locator('summary:has-text("Admin Panel")');
      await expect(adminPanelSummary).toBeVisible({ timeout: 10000 });
      await adminPanelSummary.click(); // Expand the details element
      
      // Step 6: Admin accepts the player from queue
      const addButton = adminPage.locator('button:has-text("Add")').first();
      await expect(addButton).toBeVisible({ timeout: 10000 });
      await addButton.click();
      
      // Step 6: Wait for player to be moved to game
      await playerPage.waitForURL(/\/game\/.*/, { timeout: 15000 });
      
      // Step 7: Start the game (should now be enabled with 2 players)
      await adminPage.waitForTimeout(2000);
      const startButton = adminPage.locator('button:has-text("Start game")');
      await expect(startButton).toBeEnabled({ timeout: 10000 });
      await startButton.click();
      
      // Step 8: Verify both players see the active game
      await expect(adminPage.locator('text=Pot:')).toBeVisible();
      await expect(playerPage.locator('text=Pot:')).toBeVisible();
      
      // Step 9: Look for player actions (indicating game is active)
      await adminPage.waitForSelector('.player-actions button', { timeout: 15000 });
      await playerPage.waitForSelector('.player-actions button', { timeout: 15000 });
      
      // Step 10: Try to make a simple action
      const actionButtons = adminPage.locator('.player-actions button:not([disabled])');
      if (await actionButtons.count() > 0) {
        await actionButtons.first().click();
        console.log('Admin made an action');
      }
      
      // Step 11: Take final screenshots
      await adminPage.screenshot({ path: 'test-results/simple-game-admin.png' });
      await playerPage.screenshot({ path: 'test-results/simple-game-player.png' });
      
      console.log('✅ Two-player game successfully created and started!');
      
    } finally {
      await adminContext.close();
      await playerContext.close();
    }
  });
});