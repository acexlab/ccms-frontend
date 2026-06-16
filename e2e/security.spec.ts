import { test, expect } from '@playwright/test';

test.describe('Role-based Security and Routing Guard Checks', () => {
  test('should redirect unauthenticated users trying to access dashboards to login page', async ({ page }) => {
    // Attempt navigating directly to Court Dashboard
    await page.goto('/court/dashboard');
    await expect(page).toHaveURL(/\/login/);

    // Attempt navigating directly to Bank Dashboard
    await page.goto('/bank/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should prevent Court Officer from accessing Bank Portal routes', async ({ page }) => {
    // 1. Log in as Court Officer
    await page.goto('/login');
    await page.locator('input[formControlName="username"]').fill('court.user');
    await page.locator('input[formControlName="password"]').fill('Password@123');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/court\/dashboard/);

    // 2. Try to jump to bank dashboard url manually
    await page.goto('/bank/dashboard');
    
    // Expect redirection away from Bank layout
    // In our auth guards, bankGuard blocks access and redirects back to login or court dashboard
    await expect(page).not.toHaveURL(/\/bank\/dashboard/);
  });

  test('should prevent Bank Officer from accessing Court Portal routes', async ({ page }) => {
    // 1. Log in as Bank Officer
    await page.goto('/login');
    await page.locator('input[formControlName="username"]').fill('bank.user');
    await page.locator('input[formControlName="password"]').fill('Password@123');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/bank\/dashboard/);

    // 2. Try to jump to court create-case url manually
    await page.goto('/court/create-case');

    // Expect redirection away from Court page
    await expect(page).not.toHaveURL(/\/court\/create-case/);
  });
});
