import { test, expect } from '@playwright/test';

test.describe('Bank Case Processing Flow', () => {
  test('should log in as Bank Officer, open awaiting cases, submit freeze response, and verify completed status', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.locator('input[formControlName="username"]').fill('bank.user');
    await page.locator('input[formControlName="password"]').fill('Password@123');
    await page.locator('button[type="submit"]').click();

    // 2. Dashboard verification
    await expect(page).toHaveURL(/\/bank\/dashboard/);

    // 3. Open Cases Inbox (skipping Run Manual Batch)
    await page.goto('/bank/cases');
    await expect(page).toHaveURL(/\/bank\/cases/);

    // 4. Open "Awaiting Action" tab case
    // Case E (CCMS-TEST-0005) is already seeded as AccountValidated (Awaiting Action).
    await page.locator('text=CCMS-TEST-0005').click();
    await expect(page).toHaveURL(/\/bank\/cases\/CCMS-TEST-0005/);

    // Verify detail elements
    await expect(page.locator('h1')).toContainText('Case Details');
    await expect(page.locator('text=AccountValidated')).toBeVisible();

    // 5. Navigate to Response Form
    await page.locator('button:has-text("Respond to Judicial Order")').click();
    await expect(page).toHaveURL(/\/bank\/cases\/CCMS-TEST-0005\/freeze-response/);

    // 6. Submit Freeze Response
    await page.locator('input[type="number"]').fill('12000');
    await page.locator('textarea').fill('E2E Test Freeze successfully applied.');
    
    // Handled dialog popup alert
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('submitted successfully');
      await dialog.accept();
    });

    await page.locator('button:has-text("Submit Response")').click();

    // 7. Verify redirected back to detail and status is now FreezeApplied
    await expect(page).toHaveURL(/\/bank\/cases\/CCMS-TEST-0005/);
    await expect(page.locator('text=FreezeApplied')).toBeVisible();
  });
});
