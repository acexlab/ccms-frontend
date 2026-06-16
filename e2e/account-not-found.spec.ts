import { test, expect } from '@playwright/test';

test.describe('Account Not Found Auto-Resolve Flow', () => {
  test('should verify auto-resolution as AccountNotFound for invalid case records', async ({ page }) => {
    // 1. Login as Bank Officer
    await page.goto('/login');
    await page.locator('input[formControlName="username"]').fill('bank.user');
    await page.locator('input[formControlName="password"]').fill('Password@123');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/bank\/dashboard/);

    // 2. Go to inbox and check auto-resolved tab
    await page.goto('/bank/cases');
    
    // Switch to Auto-Resolved tab/filter
    await page.locator('role=tab[name="Auto Resolved"], button:has-text("Auto Resolved"), text=Auto Resolved').click();
    
    // Check that pre-seeded Case H (CCMS-TEST-0008) appears there as AccountNotFound
    await page.locator('text=CCMS-TEST-0008').click();
    await expect(page).toHaveURL(/\/bank\/cases\/CCMS-TEST-0008/);
    await expect(page.locator('text=AccountNotFound')).toBeVisible();
    await expect(page.locator('text=No matching account found in bank records')).toBeVisible();
  });
});
