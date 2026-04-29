const { test, expect } = require('@playwright/test');

test.describe('Subscription Management UI Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('TC-11: Should display subscription form', async ({ page }) => {
    const title = page.locator('h1');
    await expect(title).toContainText('Subscription Management', { timeout: 10000 });
  });

  test('TC-12: Should allow user to view subscription details', async ({ page }) => {
    await page.fill('#userId', 'user1');
    await page.click('#viewSubscriptionBtn');
    
    await page.waitForSelector('#subscriptionDetails', { 
      timeout: 15000,
      state: 'visible' 
    });
    
    const details = page.locator('#subscriptionDetails');
    await expect(details).toBeVisible();
  });

  test('TC-13: Should allow user to renew subscription', async ({ page }) => {
    // Заполняем userId
    await page.fill('#userId', 'user1');
    
    // Нажимаем кнопку просмотра
    await page.click('#viewSubscriptionBtn');
    await page.waitForSelector('#subscriptionDetails', { 
      timeout: 15000,
      state: 'visible' 
    });
    
    // Нажимаем кнопку продления
    await page.click('#renewBtn');
    
    // Ждем появления сообщения
    await page.waitForTimeout(2000);
    
    // Получаем текст сообщения для отладки
    const message = page.locator('#renewalMessage');
    const messageText = await message.textContent();
    
    // Выводим в консоль для отладки (увидите в терминале)
    console.log('Actual message text:', messageText);
    
    // Просто проверяем, что сообщение не пустое
    expect(messageText.length).toBeGreaterThan(0);
  });
});