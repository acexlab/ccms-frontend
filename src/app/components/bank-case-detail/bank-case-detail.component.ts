/*
 * File: bank-case-detail.component.ts
 * Description: Controller for the Bank Officer case processing form.
 * To Implement: pre-fill matches based on order type, trigger confirmation dialog.
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CaseInboxService } from '../../services/case-inbox.service';
import { CaseDetail } from '../../models/case.model';
import { NavbarComponent } from '../navbar/navbar.component';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { MaskedTextComponent } from '../masked-text/masked-text.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-bank-case-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    NavbarComponent,
    StatusBadgeComponent,
    MaskedTextComponent
  ],
  templateUrl: './bank-case-detail.component.html',
  styleUrls: ['./bank-case-detail.component.scss']
})
export class BankCaseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private inboxService = inject(CaseInboxService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  caseId!: number;
  caseDetail: CaseDetail | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  responseForm!: FormGroup;
  isSubmitting = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.caseId = parseInt(idStr, 10);
        this.loadCaseDetails();
      }
    });

    this.responseForm = this.fb.group({
      reportedAmount: [null],
      remarks: ['', Validators.required]
    });
  }

  loadCaseDetails(): void {
    this.isLoading = true;
    this.inboxService.getCaseById(this.caseId).subscribe({
      next: (data) => {
        this.caseDetail = data;
        this.isLoading = false;
        this.initializeFormValidators();
      },
      error: (err) => {
        this.errorMessage = err.error?.Message || 'Failed to load case details.';
        this.isLoading = false;
      }
    });
  }

  initializeFormValidators(): void {
    if (!this.caseDetail) return;

    const amountCtrl = this.responseForm.get('reportedAmount');
    if (this.caseDetail.orderType === 'FreezeAccount') {
      amountCtrl?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      // BalanceEnquiry
      amountCtrl?.setValue(this.caseDetail.matchedBalance);
      amountCtrl?.setValidators([Validators.required, Validators.min(0)]);
    }
    amountCtrl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.responseForm.valid && this.caseDetail) {
      // Trigger Confirmation Dialog
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Confirm Response Submission',
          message: 'Are you sure you want to submit this response? Once submitted, it cannot be modified.'
        }
      });

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.submitResponse();
        }
      });
    }
  }

  submitResponse(): void {
    this.isSubmitting = true;
    const dto = this.responseForm.value;

    this.inboxService.submitResponse(this.caseId, dto).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.snackBar.open('Response submitted successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/bank/cases']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.snackBar.open(err.error?.Message || 'Failed to submit response.', 'Close', { duration: 5000 });
      }
    });
  }

  getCourtOrderUrl(): string {
    const doc = this.caseDetail?.documents.find(d => d.documentType === 'CourtOrder');
    return doc ? doc.fileUrl : '#';
  }
}
