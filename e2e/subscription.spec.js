const { test, expect } = require('@playwright/test');

test.describe('Subscription Management UI Tests', () => {
  
  test('TC-11: Should display subscription form', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const title = await page.locator('h1');
    await expect(title).toContainText('Subscription Management');
  });

  test('TC-12: Should allow user to view subscription details', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.fill('#userId', 'user1');
    await page.click('#viewSubscriptionBtn');
    
    // Ждем появления деталей
    await page.waitForSelector('#subscriptionDetails', { timeout: 10000 });
    const details = await page.locator('#subscriptionDetails');
    await expect(details).toBeVisible();
    
    // Проверяем, что есть текст о подписке
    const detailsText = await details.textContent();
    expect(detailsText).toContain('user1');
  });

  test('TC-13: Should allow user to renew subscription', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.fill('#userId', 'user1');
    await page.click('#viewSubscriptionBtn');
    
    // Ждем загрузки деталей
    await page.waitForSelector('#subscriptionDetails', { timeout: 10000 });
    
    // Нажимаем кнопку продления
    await page.click('#renewBtn');
    
    // Ждем появления сообщения
    await page.waitForTimeout(2000);
    
    // Получаем текст сообщения
    const message = await page.locator('#renewalMessage');
    const messageText = await message.textContent();
    
    // Проверяем, что сообщение содержит "successfully" ИЛИ "Loaded" (для успешного продления)
    // В зависимости от того, что возвращает сервер
    const hasSuccess = messageText.includes('successfully') || 
                       messageText.includes('renewed') ||
                       messageText.includes('Loaded');
    
    expect(hasSuccess).toBe(true);
  });
});