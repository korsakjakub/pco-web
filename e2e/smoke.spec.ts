import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('should load homepage and create new game', async ({ page }) => {
    await page.goto('/');
    
    // Check that the homepage loads
    await expect(page.locator('h1')).toContainText('jetons');
    
    // Fill in player name
    await page.fill('input[name="playerName"]', 'TestPlayer');
    
    // Create new game
    await page.click('button:has-text("New game")');
    
    // Should navigate to game (admin goes directly to game)
    await page.waitForURL(/\/game\/.*/, { timeout: 10000 });
    
    // Should show game page elements
    await expect(page.locator('button:has-text("Start game")')).toBeVisible();
    await expect(page.locator('text=Pot:')).toBeVisible();
  });

  test('should load join page with valid queue ID', async ({ page }) => {
    // First create a room to get a queue ID from context
    await page.goto('/');
    await page.fill('input[name="playerName"]', 'AdminPlayer');
    await page.click('button:has-text("New game")');
    await page.waitForURL(/\/game\/(.*)/, { timeout: 10000 });
    
    // Extract queueId from context in sessionStorage
    const queueId = await page.evaluate(() => {
      const ctx = sessionStorage.getItem('ctx');
      return ctx ? JSON.parse(ctx).queueId : null;
    });
    expect(queueId).toBeTruthy();
    
    // Now test joining that room using the correct queueId
    await page.goto(`/join/${queueId}`);
    
    // Should load join page
    await expect(page.locator('h1')).toContainText('Join Room');
    
    // Fill in player name and join
    await page.fill('input[name="playerName"]', 'JoiningPlayer');
    await page.click('button:has-text("Join")');
    
    // Should navigate to queue page
    await page.waitForURL(/\/queue\/.*/, { timeout: 10000 });
    
    // Should show queue page content
    await expect(page.locator('h1')).toContainText('waiting in the queue');
  });

  test('should handle invalid routes gracefully', async ({ page }) => {
    await page.goto('/invalid-route');
    
    // Should show not found page or redirect
    await expect(page).toHaveURL(/\/(.*)/);
  });

  test('should validate player name requirements', async ({ page }) => {
    await page.goto('/');
    
    // Button should be disabled with empty name
    const submitButton = page.locator('button:has-text("New game")');
    await expect(submitButton).toBeDisabled();
    
    // Button should be disabled with single character
    await page.fill('input[name="playerName"]', 'A');
    await expect(submitButton).toBeDisabled();
    
    // Button should be enabled with valid name
    await page.fill('input[name="playerName"]', 'ValidName');
    await expect(submitButton).toBeEnabled();
  });
});