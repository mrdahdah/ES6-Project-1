const { test, expect } = require('@playwright/test');

test.beforeAll(async () => {
  // Nothing - assume server started in CI or by dev
});

test('basic flow: post and live updates', async ({ page }) => {
  await page.goto('http://localhost:8080');
  await page.fill('#new-text', 'Playwright test post');
  await page.click('#post-btn');
  await expect(page.locator('[data-id^="p-"]')).toHaveCount(1);

  // test manual live
  await page.click('#send-live');
  await page.waitForSelector('[data-id^="man-"]', { timeout: 2000 });
});