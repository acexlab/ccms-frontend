import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('Court Case Registration Flow', () => {
  test('should log in as Court Officer, fill multi-step case form, upload files, and verify success', async ({ page }) => {
    // 1. Go to Login Page
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);

    // 2. Perform Login
    await page.locator('input[formControlName="username"]').fill('court.user');
    await page.locator('input[formControlName="password"]').fill('Password@123');
    await page.locator('button[type="submit"]').click();

    // 3. Confirm Navigation to Court Dashboard
    await expect(page).toHaveURL(/\/court\/dashboard/);
    await expect(page.locator('h1')).toContainText('Officer Overview');

    // 4. Navigate to Create Case
    await page.locator('aside >> text=Create Case').click();
    await expect(page).toHaveURL(/\/court\/create-case/);

    // 5. Fill Step 1: Complainant and Defendant details
    await page.locator('input[formControlName="complainantName"]').fill('State Tax Dept');
    await page.locator('input[formControlName="complainantId"]').fill('ABCDE1234F');
    await page.locator('input[formControlName="defendantName"]').fill('Rajesh Kumar');
    await page.locator('input[formControlName="defendantId"]').fill('123456789012');
    await page.locator('input[formControlName="defendantAccountNumber"]').fill('111122223333');
    await page.locator('input[formControlName="defendantBankName"]').fill('SBI');
    
    // Go to next step
    await page.locator('button:has-text("Next")').click();

    // 6. Step 2: Order Type and Amount (Default is Freeze Account)
    await page.locator('input[formControlName="freezeAmount"]').fill('50000');
    await page.locator('button:has-text("Next")').click();

    // 7. Step 3: Document Uploads
    const uploadsPath = path.resolve(__dirname, '../../ccms-backend/wwwroot/test-files');
    
    // Set file input files
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

    // 8. Step 4: Declaration Check and Submit
    await page.locator('input[formControlName="declaration"]').check();
    
    // Handle dialog popup alert
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('Case Submitted Successfully');
      await dialog.accept();
    });

    await page.locator('button:has-text("Submit Order")').click();

    // 9. Verify redirection to Dashboard
    await expect(page).toHaveURL(/\/court\/dashboard/);
  });
});
