import { test, expect } from '@playwright/test';

test.describe('Debug Navigation Flow', () => {
  test('should debug actual navigation flow', async ({ page }) => {
    console.log('Starting debug test...');
    
    // Go to homepage
    await page.goto('/');
    console.log('Homepage URL:', page.url());
    
    // Take screenshot of homepage
    await page.screenshot({ path: 'debug-homepage.png' });
    
    // Fill in player name
    await page.fill('input[name="playerName"]', 'DebugPlayer');
    
    // Create new game
    await page.click('button:has-text("New game")');
    
    // Wait for navigation and log where we ended up
    await page.waitForTimeout(3000);
    
    console.log('After creating game URL:', page.url());
    
    // Take screenshot after navigation
    await page.screenshot({ path: 'debug-after-create.png' });
    
    // Log page title and main content
    const title = await page.title();
    console.log('Page title:', title);

    // Instead of h1, check for a unique game element
    const potVisible = await page.locator('text=Pot:').isVisible();
    const gameInfoVisible = await page.locator('.game-info').isVisible();
    console.log('Pot visible:', potVisible);
    console.log('Game info visible:', gameInfoVisible);
    
    // Check what elements are visible
    const visibleElements = await page.evaluate(() => {
      const elements = [];
      const selectors = [
        'h1', 'h2', 'h3',
        '.container', '.game', '.queue',
        '.circular-table', '.game-info',
        'button', 'input'
      ];
      
      selectors.forEach(selector => {
        const element = document.querySelector(selector);
        if (element && element.offsetParent !== null) {
          elements.push({
            selector,
            text: element.textContent?.trim().substring(0, 100),
            visible: true
          });
        }
      });
      
      return elements;
    });
    
    console.log('Visible elements:', JSON.stringify(visibleElements, null, 2));
    
    // Extract any IDs from URL
    const urlMatch = page.url().match(/\/(game|queue)\/([^/]+)/);
    if (urlMatch) {
      console.log('Navigation type:', urlMatch[1]);
      console.log('ID:', urlMatch[2]);
    }
  });

  test('should debug join flow', async ({ browser }) => {
    // Create first player
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    
    await page1.goto('/');
    await page1.fill('input[name="playerName"]', 'FirstPlayer');
    await page1.click('button:has-text("New game")');
    await page1.waitForTimeout(3000);
    
    const url1 = page1.url();
    console.log('First player URL:', url1);
    
    // Extract room/queue ID
    const idMatch = url1.match(/\/(game|queue)\/([^/]+)/);
    if (!idMatch) {
      console.log('Could not extract ID from URL');
      return;
    }
    
    const id = idMatch[2];
    console.log('Extracted ID:', id);
    
    // Try to join with second player using the ID
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    
    await page2.goto(`/join/${id}`);
    console.log('Join page URL:', page2.url());
    
    await page2.screenshot({ path: 'debug-join-page.png' });
    
    const joinPageContent = await page2.locator('h1').textContent();
    console.log('Join page content:', joinPageContent);
    
    // Clean up
    await context1.close();
    await context2.close();
  });
});