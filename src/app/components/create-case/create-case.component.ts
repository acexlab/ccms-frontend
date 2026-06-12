/*
 * File: create-case.component.ts
 * Description: Controller for the wizard step form to create a new case order.
 * To Implement: Handle file upload references and dynamic validator hooks.
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CaseService } from '../../services/case.service';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-create-case',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    FileUploadComponent,
    NavbarComponent
  ],
  templateUrl: './create-case.component.html',
  styleUrls: ['./create-case.component.scss']
})
export class CreateCaseComponent implements OnInit {
  private fb = inject(FormBuilder);
  private caseService = inject(CaseService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  complainantForm!: FormGroup;
  defendantForm!: FormGroup;
  orderForm!: FormGroup;

  courtOrderFile: File | null = null;
  aadhaarFile: File | null = null;
  panFile: File | null = null;

  isLoading = false;

  ngOnInit(): void {
    this.complainantForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.defendantForm = this.fb.group({
      name: ['', Validators.required],
      aadhaar: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      pan: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      accountNumber: ['', Validators.required],
      bankCode: ['', Validators.required]
    });

    this.orderForm = this.fb.group({
      orderType: ['', Validators.required],
      freezeAmount: [null]
    });

    // Conditional Validator for freezeAmount
    this.orderForm.get('orderType')?.valueChanges.subscribe((type) => {
      const amountCtrl = this.orderForm.get('freezeAmount');
      if (type === 'FreezeAccount') {
        amountCtrl?.setValidators([Validators.required, Validators.min(1)]);
      } else {
        amountCtrl?.clearValidators();
      }
      amountCtrl?.updateValueAndValidity();
    });
  }

  onCourtOrderSelected(file: File): void {
    this.courtOrderFile = file;
  }

  onAadhaarSelected(file: File): void {
    this.aadhaarFile = file;
  }

  onPanSelected(file: File): void {
    this.panFile = file;
  }

  areDocumentsUploaded(): boolean {
    return !!(this.courtOrderFile && this.aadhaarFile && this.panFile);
  }

  onSubmit(): void {
    if (
      this.complainantForm.valid &&
      this.defendantForm.valid &&
      this.orderForm.valid &&
      this.areDocumentsUploaded()
    ) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('complainantName', this.complainantForm.value.name);
      formData.append('defendantName', this.defendantForm.value.name);
      formData.append('defendantAadhaar', this.defendantForm.value.aadhaar);
      formData.append('defendantPan', this.defendantForm.value.pan);
      formData.append('defendantAccountNumber', this.defendantForm.value.accountNumber);
      formData.append('bankCode', this.defendantForm.value.bankCode);
      formData.append('orderType', this.orderForm.value.orderType);
      
      if (this.orderForm.value.freezeAmount) {
        formData.append('freezeAmount', this.orderForm.value.freezeAmount.toString());
      }

      formData.append('courtOrderFile', this.courtOrderFile!);
      formData.append('aadhaarFile', this.aadhaarFile!);
      formData.append('panFile', this.panFile!);

      this.caseService.createCase(formData).subscribe({
        next: (result) => {
          this.isLoading = false;
          this.snackBar.open(`Case raised successfully! ID: ${result.caseNumber}`, 'Close', { duration: 5000 });
          this.router.navigate(['/court/cases', result.id]);
        },
        error: (err) => {
          this.isLoading = false;
          this.snackBar.open(err.error?.Message || 'An error occurred creating the case.', 'Close', { duration: 5000 });
        }
      });
    }
  }
}
