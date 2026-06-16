import { test, expect } from '@playwright/test';

test.describe('Balance Enquiry End-to-End Flow', () => {
  test('should open pre-validated balance enquiry case, submit balance response, and verify complete', async ({ page }) => {
    // 1. Login as HDFC Bank Officer
    await page.goto('/login');
    await page.locator('input[formControlName="username"]').fill('hdfc.user');
    await page.locator('input[formControlName="password"]').fill('Password@123');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/bank\/dashboard/);

    // 2. Go to inbox and open pre-validated Case I (CCMS-TEST-0009)
    await page.goto('/bank/cases');
    await page.locator('text=CCMS-TEST-0009').click();
    await expect(page.locator('text=AccountValidated')).toBeVisible();

    // 3. Submit balance response
    await page.locator('button:has-text("Respond to Judicial Order")').click();
    await expect(page).toHaveURL(/\/bank\/cases\/CCMS-TEST-0009\/balance-response/);

    await page.locator('textarea').fill('E2E Test Balance enquiry responded.');
    
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('submitted successfully');
      await dialog.accept();
    });

    await page.locator('button:has-text("Submit Response")').click();

    // 4. Verify status is now BalanceProvided
    await expect(page).toHaveURL(/\/bank\/cases\/CCMS-TEST-0009/);
    await expect(page.locator('text=BalanceProvided')).toBeVisible();
  });
});
