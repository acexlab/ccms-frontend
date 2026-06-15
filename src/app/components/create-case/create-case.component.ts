import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CaseService } from '../../services/case.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-case',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-case.component.html',
  styleUrls: ['./create-case.component.scss']
})
export class CreateCaseComponent {
  private readonly fb = inject(FormBuilder);
  private readonly caseService = inject(CaseService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  currentStep = 1;
  totalSteps = 4;
  orderType = 'freeze';
  isSubmitting = false;
  submitSuccess = false;
  referenceId = '';

  // Dedicated file properties for individual uploads
  courtOrderFile: File | null = null;
  aadhaarFile: File | null = null;
  panFile: File | null = null;

  createCaseForm: FormGroup = this.fb.group({
    complainantName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]{3,100}$/)]],
    complainantId: ['', [Validators.required, Validators.pattern(/^(?:\d{12}|[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1})$/i)]],
    defendantName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]{3,100}$/)]],
    defendantId: ['', [Validators.required, Validators.pattern(/^(?:\d{12}|[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1})$/i)]],
    defendantAccountNumber: ['', [Validators.required, Validators.pattern(/^\d{9,18}$/)]],
    defendantBankName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]{3,100}$/)]],
    orderType: ['freeze', [Validators.required]],
    freezeAmount: [null, [Validators.min(0)]],
    declaration: [false, [Validators.requiredTrue]]
  });

  get progressPercentage(): number {
    return ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
  }

  goToStep(step: number): void {
    if (step > this.currentStep) {
      // Direct jump forward: sequentially validate each preceding step
      const originalCurrent = this.currentStep;
      for (let i = originalCurrent; i < step; i++) {
        this.currentStep = i;
        if (!this.validateCurrentStep()) {
          this.currentStep = i; // Lock user at the invalid step
          return;
        }
      }
    }
    this.currentStep = step;
  }

  changeStep(delta: number): void {
    const nextStep = this.currentStep + delta;
    if (nextStep >= 1 && nextStep <= this.totalSteps) {
      if (delta > 0 && !this.validateCurrentStep()) {
        return; // Navigation blocked due to validation errors
      }
      this.currentStep = nextStep;
    } else if (this.currentStep === this.totalSteps && delta === 1) {
      this.submitCase();
    }
  }

  validateCurrentStep(): boolean {
    if (this.currentStep === 1) {
      const step1Fields = [
        'complainantName',
        'complainantId',
        'defendantName',
        'defendantId',
        'defendantAccountNumber',
        'defendantBankName'
      ];
      let isValid = true;
      step1Fields.forEach(field => {
        const control = this.createCaseForm.get(field);
        if (control) {
          control.markAsTouched();
          if (control.invalid) {
            isValid = false;
          }
        }
      });
      return isValid;
    }
    if (this.currentStep === 2) {
      const control = this.createCaseForm.get('freezeAmount');
      if (this.orderType === 'freeze' && control) {
        control.markAsTouched();
        return control.valid;
      }
      return true;
    }
    if (this.currentStep === 3) {
      if (!this.courtOrderFile) {
        alert('Please upload the mandatory Court Order PDF.');
        return false;
      }
      if (!this.aadhaarFile) {
        alert('Please upload the Aadhaar Copy PDF/Image.');
        return false;
      }
      if (!this.panFile) {
        alert('Please upload the PAN Copy PDF/Image.');
        return false;
      }
      return true;
    }
    return true;
  }

  setOrderType(type: string): void {
    this.orderType = type;
    this.createCaseForm.get('orderType')?.setValue(type);
    
    const amountControl = this.createCaseForm.get('freezeAmount');
    if (type === 'enquiry') {
      amountControl?.clearValidators();
      amountControl?.setValue(null);
    } else {
      amountControl?.setValidators([Validators.min(0)]);
    }
    amountControl?.updateValueAndValidity();
  }

  onFileSelected(event: any, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} exceeds the 5MB limit.`);
        return;
      }
      
      if (type === 'courtOrder') {
        this.courtOrderFile = file;
      } else if (type === 'aadhaar') {
        this.aadhaarFile = file;
      } else if (type === 'pan') {
        this.panFile = file;
      }
    }
  }

  removeFile(type: string): void {
    if (type === 'courtOrder') {
      this.courtOrderFile = null;
    } else if (type === 'aadhaar') {
      this.aadhaarFile = null;
    } else if (type === 'pan') {
      this.panFile = null;
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  submitCase(): void {
    if (this.createCaseForm.invalid) {
      this.createCaseForm.markAllAsTouched();
      return;
    }

    if (!this.courtOrderFile || !this.aadhaarFile || !this.panFile) {
      alert('Please upload all three mandatory files before submitting.');
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('complainantName', this.createCaseForm.get('complainantName')?.value || '');
    formData.append('complainantId', this.createCaseForm.get('complainantId')?.value || '');
    formData.append('defendantName', this.createCaseForm.get('defendantName')?.value || '');
    formData.append('defendantId', this.createCaseForm.get('defendantId')?.value || '');
    formData.append('defendantAccountNumber', this.createCaseForm.get('defendantAccountNumber')?.value || '');
    formData.append('defendantBankName', this.createCaseForm.get('defendantBankName')?.value || '');
    
    const mappedOrderType = this.orderType === 'freeze' ? 'FreezeAccount' : 'BalanceEnquiry';
    formData.append('orderType', mappedOrderType);

    const amount = this.createCaseForm.get('freezeAmount')?.value;
    if (amount !== null && amount !== undefined && this.orderType === 'freeze') {
      formData.append('freezeAmount', amount.toString());
    }

    // Append dedicated files individually
    formData.append('courtOrderFile', this.courtOrderFile);
    formData.append('aadhaarFile', this.aadhaarFile);
    formData.append('panFile', this.panFile);

    this.caseService.createCase(formData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.referenceId = res.caseNumber;
        alert(`Case Submitted Successfully. Reference ID: ${this.referenceId}`);
        this.router.navigate(['/court/dashboard']);
      },
      error: (err) => {
        this.isSubmitting = false;
        alert(err.error?.message || 'An error occurred while submitting the case.');
      }
    });
  }
}