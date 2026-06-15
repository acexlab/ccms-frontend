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

  uploadedFiles: File[] = [];

  createCaseForm: FormGroup = this.fb.group({
    complainantName: ['', [Validators.required]],
    complainantId: ['', [Validators.required]],
    defendantName: ['', [Validators.required]],
    defendantId: ['', [Validators.required]],
    defendantAccountNumber: ['', [Validators.required]],
    defendantBankName: ['', [Validators.required]],
    orderType: ['freeze', [Validators.required]],
    freezeAmount: [null, [Validators.min(0)]],
    declaration: [false, [Validators.requiredTrue]]
  });

  get progressPercentage(): number {
    return ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
  }

  goToStep(step: number): void {
    if (step <= this.totalSteps) {
      this.currentStep = step;
      if (this.currentStep === 4) {
        this.populateReview();
      }
    }
  }

  changeStep(delta: number): void {
    const nextStep = this.currentStep + delta;
    if (nextStep >= 1 && nextStep <= this.totalSteps) {
      // Validate steps before proceeding
      if (delta > 0 && !this.validateCurrentStep()) {
        return;
      }
      this.currentStep = nextStep;
      if (this.currentStep === 4) {
        this.populateReview();
      }
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
      if (this.uploadedFiles.length === 0) {
        alert('Please upload the mandatory Court Order file.');
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

  handleDrop(e: DragEvent): void {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files) {
      this.handleFiles(e.dataTransfer.files);
    }
  }

  handleFiles(files: FileList | File[]): void {
    Array.from(files).forEach((file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} exceeds the 5MB limit.`);
        return;
      }
      this.uploadedFiles.push(file);
    });
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  populateReview(): void {
    // Handled dynamically via Angular template bindings of form values
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

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('complainantName', this.createCaseForm.get('complainantName')?.value || '');
    formData.append('complainantId', this.createCaseForm.get('complainantId')?.value || '');
    formData.append('defendantName', this.createCaseForm.get('defendantName')?.value || '');
    formData.append('defendantId', this.createCaseForm.get('defendantId')?.value || '');
    formData.append('defendantAccountNumber', this.createCaseForm.get('defendantAccountNumber')?.value || '');
    formData.append('defendantBankName', this.createCaseForm.get('defendantBankName')?.value || '');
    
    // Map order type to expected backend names
    const mappedOrderType = this.orderType === 'freeze' ? 'FreezeAccount' : 'BalanceEnquiry';
    formData.append('orderType', mappedOrderType);

    const amount = this.createCaseForm.get('freezeAmount')?.value;
    if (amount !== null && amount !== undefined && this.orderType === 'freeze') {
      formData.append('freezeAmount', amount.toString());
    }

    // Append files
    this.uploadedFiles.forEach((file) => {
      formData.append('files', file);
    });

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