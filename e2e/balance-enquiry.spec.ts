import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('Balance Enquiry End-to-End Flow', () => {
  test('should create balance enquiry, validate it, submit balance response, and verify complete', async ({ page }) => {
    // 1. Create a Balance Enquiry Case as Court Officer
    await page.goto('/login');
    await page.locator('input[formControlName="username"]').fill('court.user');
    await page.locator('input[formControlName="password"]').fill('Password@123');
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/\/court\/dashboard/);
    await page.locator('aside >> text=Create Case').click();

    // Fill form (Aadhaar Priya Sharma - HDFC)
    await page.locator('input[formControlName="complainantName"]').fill('Central Tax Dept');
    await page.locator('input[formControlName="complainantId"]').fill('ABCDE1234F');
    await page.locator('input[formControlName="defendantName"]').fill('Priya Sharma');
    await page.locator('input[formControlName="defendantId"]').fill('987654321098');
    await page.locator('input[formControlName="defendantAccountNumber"]').fill('INVALID'); // Will match by Aadhaar
    await page.locator('input[formControlName="defendantBankName"]').fill('HDFC');

    await page.locator('button:has-text("Next")').click();

    // Step 2: Select Balance Enquiry
    await page.locator('text=Balance Enquiry').click();
    await page.locator('button:has-text("Next")').click();

    // Step 3: Document Uploads
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
      expect(msg).toContain('Case Submitted Successfully');
      // Extract case number: Reference ID: CCMS-YYYYMMDD-XXXX
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

    // 2. Login as HDFC Bank Officer to run batch & respond
    await page.goto('/login');
    await page.locator('input[formControlName="username"]').fill('hdfc.user');
    await page.locator('input[formControlName="password"]').fill('Password@123');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/bank\/dashboard/);

    // Run batch
    await page.locator('button:has-text("Run Manual Batch")').click();
    await expect(page.locator('.mat-mdc-snack-bar-label, mat-snack-bar-container')).toBeVisible();

    // Go to inbox
    await page.goto('/bank/cases');
    
    // Open the newly validated case
    await page.locator(`text=${createdCaseNo}`).click();
    await expect(page.locator('text=AccountValidated')).toBeVisible();

    // Submit balance response
    await page.locator('button:has-text("Respond to Judicial Order")').click();
    await expect(page).toHaveURL(new RegExp(`/bank/cases/${createdCaseNo}/balance-response`));

    await page.locator('textarea').fill('E2E Test Balance enquiry responded.');
    
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('submitted successfully');
      await dialog.accept();
    });

    await page.locator('button:has-text("Submit Response")').click();

    // Verify status is now BalanceProvided
    await expect(page).toHaveURL(new RegExp(`/bank/cases/${createdCaseNo}$`));
    await expect(page.locator('text=BalanceProvided')).toBeVisible();
  });
});
