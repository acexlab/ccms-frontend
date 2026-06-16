import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('Account Not Found Auto-Resolve Flow', () => {
  test('should create an invalid case, validate via batch, and verify auto-resolution as AccountNotFound', async ({ page }) => {
    // 1. Create invalid case as Court Officer
    await page.goto('/login');
    await page.locator('input[formControlName="username"]').fill('court.user');
    await page.locator('input[formControlName="password"]').fill('Password@123');
    await page.locator('button[type="submit"]').click();

    await page.locator('aside >> text=Create Case').click();

    // Fill invalid details (won't match any customer)
    await page.locator('input[formControlName="complainantName"]').fill('Central Tax Dept');
    await page.locator('input[formControlName="complainantId"]').fill('ABCDE1234F');
    await page.locator('input[formControlName="defendantName"]').fill('Unknown Person');
    await page.locator('input[formControlName="defendantId"]').fill('000000000000');
    await page.locator('input[formControlName="defendantAccountNumber"]').fill('999999999999');
    await page.locator('input[formControlName="defendantBankName"]').fill('SBI');

    await page.locator('button:has-text("Next")').click();
    await page.locator('button:has-text("Next")').click(); // default freeze, amount null is fine for step 2 check if optional

    // Step 3: Files
    const uploadsPath = path.resolve(__dirname, '../../ccms-backend/wwwroot/test-files');
    const fileChooserPromise1 = page.waitForEvent('filechooser');
    await page.locator('.upload-zone >> xpath=.. >> text=Court Order').click();
    const fileChooser1 = await fileChooserPromise1;
    await fileChooser1.setFiles(path.join(uploadsPath, 'small-order.pdf'));

    const fileChooserPromise2 = page.waitForEvent('filechooser');
    await page.locator('.upload-zone >> xpath=.. >> text=Aadhaar Copy').click();
    const fileChooser2 = await fileChooserPromise2;
    await fileChooser2.setFiles(path.join(uploadsPath, 'aadhaar.jpg'));

    const fileChooserPromise3 = page.waitForEvent('filechooser');
    await page.locator('.upload-zone >> xpath=.. >> text=PAN Copy').click();
    const fileChooser3 = await fileChooserPromise3;
    await fileChooser3.setFiles(path.join(uploadsPath, 'pan.png'));

    await page.locator('button:has-text("Next")').click();

    // Step 4: Submit
    await page.locator('input[formControlName="declaration"]').check();

    let createdCaseNo = '';
    page.once('dialog', async dialog => {
      const msg = dialog.message();
      const match = msg.match(/CCMS-\d+-\d+/);
      if (match) {
        createdCaseNo = match[0];
      }
      await dialog.accept();
    });

    await page.locator('button:has-text("Submit Order")').click();
    await expect(page).toHaveURL(/\/court\/dashboard/);

    // Logout
    await page.locator('button:has-text("Logout")').click();

    // 2. Login as Bank Officer, run batch and verify auto-resolved
    await page.goto('/login');
    await page.locator('input[formControlName="username"]').fill('bank.user');
    await page.locator('input[formControlName="password"]').fill('Password@123');
    await page.locator('button[type="submit"]').click();

    await page.locator('button:has-text("Run Manual Batch")').click();
    await expect(page.locator('.mat-mdc-snack-bar-label, mat-snack-bar-container')).toBeVisible();

    // Go to inbox and check auto-resolved tab
    await page.goto('/bank/cases');
    
    // Switch to Auto-Resolved tab/filter
    // In our UI, CaseInboxComponent has tab buttons: Awaiting Action, Completed, Pending Batch, Auto resolved.
    // Let's click on "Auto Resolved" tab header
    await page.locator('role=tab[name="Auto Resolved"], button:has-text("Auto Resolved"), text=Auto Resolved').click();
    
    // Check that our created case appears there as AccountNotFound
    await page.locator(`text=${createdCaseNo}`).click();
    await expect(page).toHaveURL(new RegExp(`/bank/cases/${createdCaseNo}$`));
    await expect(page.locator('text=AccountNotFound')).toBeVisible();
  });
});
