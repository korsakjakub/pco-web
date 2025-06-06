import { test, expect } from '@playwright/test';

test.describe('Explore Game Page', () => {
  test('should explore game page content and find queueId', async ({ page }) => {
    // Create a new game
    await page.goto('/');
    await page.fill('input[name="playerName"]', 'ExplorePlayer');
    await page.click('button:has-text("New game")');
    await page.waitForURL(/\/game\/.*/, { timeout: 10000 });
    
    const gameUrl = page.url();
    const roomId = gameUrl.match(/\/game\/([^/]+)/)?.[1];
    console.log('Room ID:', roomId);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/explore-game-page.png' });
    
    // Check page content for any queue-related info
    const pageText = await page.textContent('body');
    console.log('Page contains "queue":', pageText?.includes('queue'));
    console.log('Page contains "join":', pageText?.includes('join'));
    
    // Check for any links or elements that might contain queueId
    const links = await page.locator('a').all();
    console.log('Number of links:', links.length);
    
    for (let i = 0; i < links.length; i++) {
      const href = await links[i].getAttribute('href');
      const text = await links[i].textContent();
      if (href || text) {
        console.log(`Link ${i}: ${text} -> ${href}`);
      }
    }
    
    // Check local storage and session storage
    const localStorage = await page.evaluate(() => {
      const storage = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          storage[key] = localStorage.getItem(key);
        }
      }
      return storage;
    });
    
    const sessionStorage = await page.evaluate(() => {
      const storage = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          storage[key] = sessionStorage.getItem(key);
        }
      }
      return storage;
    });
    
    console.log('Local Storage:', JSON.stringify(localStorage, null, 2));
    console.log('Session Storage:', JSON.stringify(sessionStorage, null, 2));
    
    // Check if there's any share URL or invite functionality
    const shareElements = await page.locator('text=/share|invite|join|queue/i').all();
    console.log('Share/invite elements found:', shareElements.length);
    
    for (let i = 0; i < shareElements.length; i++) {
      const text = await shareElements[i].textContent();
      console.log(`Share element ${i}:`, text);
    }
    
    // Check network requests to see if queueId is in any API calls
    const responses = [];
    page.on('response', response => {
      if (response.url().includes('/api/')) {
        responses.push({
          url: response.url(),
          status: response.status()
        });
      }
    });
    
    // Wait a bit to capture any network activity
    await page.waitForTimeout(3000);
    
    console.log('API responses:', responses);
    
    // Check if we can extract queueId from context in storage
    const contextData = await page.evaluate(() => {
      const ctx = sessionStorage.getItem('ctx');
      return ctx ? JSON.parse(ctx) : null;
    });
    
    console.log('Context data:', JSON.stringify(contextData, null, 2));
    
    if (contextData && contextData.queueId) {
      console.log('Found queueId in context:', contextData.queueId);
      
      // Test if we can use this queueId to join
      const joinUrl = `/join/${contextData.queueId}`;
      console.log('Join URL would be:', joinUrl);
    }
  });
  
  test('should test actual join flow with queueId from context', async ({ browser }) => {
    // Create admin player
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    
    await adminPage.goto('/');
    await adminPage.fill('input[name="playerName"]', 'Admin');
    await adminPage.click('button:has-text("New game")');
    await adminPage.waitForURL(/\/game\/.*/, { timeout: 10000 });
    
    // Extract queueId from context
    const queueId = await adminPage.evaluate(() => {
      const ctx = sessionStorage.getItem('ctx');
      return ctx ? JSON.parse(ctx).queueId : null;
    });
    
    console.log('Extracted queueId:', queueId);
    
    if (queueId) {
      // Create joining player
      const playerContext = await browser.newContext();
      const playerPage = await playerContext.newPage();
      
      await playerPage.goto(`/join/${queueId}`);
      console.log('Join page URL:', playerPage.url());
      
      const joinPageTitle = await playerPage.locator('h1').textContent();
      console.log('Join page title:', joinPageTitle);
      
      if (joinPageTitle && joinPageTitle.includes('Join Room')) {
        await playerPage.fill('input[name="playerName"]', 'Joiner');
        await playerPage.click('button:has-text("Join")');
        
        await playerPage.waitForTimeout(3000);
        console.log('After join URL:', playerPage.url());
        
        await playerPage.screenshot({ path: 'test-results/explore-after-join.png' });
      }
      
      await playerContext.close();
    }
    
    await adminContext.close();
  });
});