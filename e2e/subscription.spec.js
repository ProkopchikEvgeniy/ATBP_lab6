const { test, expect } = require('@playwright/test');

test.describe('Subscription Management UI Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('TC-11: Should display subscription form', async ({ page }) => {
    const title = await page.locator('h1');
    await expect(title).toContainText('Subscription Management');
  });

  test('TC-12: Should allow user to view subscription details', async ({ page }) => {
    await page.fill('#userId', 'user1');
    await page.click('#viewSubscriptionBtn');
    
    await page.waitForSelector('#subscriptionDetails');
    const details = await page.locator('#subscriptionDetails');
    await expect(details).toBeVisible();
  });

  test('TC-13: Should allow user to renew subscription', async ({ page }) => {
    await page.fill('#userId', 'user1');
    await page.click('#viewSubscriptionBtn');
    await page.click('#renewBtn');
    
    await page.waitForSelector('#renewalMessage');
    const message = await page.locator('#renewalMessage');
    await expect(message).toContainText('successfully');
  });
});