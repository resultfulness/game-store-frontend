import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('./');

  await expect(page).toHaveTitle(/game-store-frontend/);
});

test('navigates to game list', async ({ page }) => {
  await page.goto('./');

  await page.getByRole('link', { name: 'games' }).click();

  await expect(page.getByRole('heading', { name: 'Games' })).toBeVisible();
});
