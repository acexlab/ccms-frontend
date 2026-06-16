import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CaseService } from '../../services/case.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-bank-case-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatIconModule],
  templateUrl: './bank-case-detail.component.html',
  styleUrls: ['./bank-case-detail.component.scss']
})
export class BankCaseDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly caseService = inject(CaseService);
  private readonly authService = inject(AuthService);

  apiUrl = environment.apiUrl.replace('/api', ''); // Base server URL for file downloads

  caseId!: number;
  caseDetails: any = null;
  isLoading = true;
  isSubmitting = false;
  responseForm!: FormGroup;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.caseId = parseInt(idParam, 10);
      this.loadCaseDetails();
    }
  }

  loadCaseDetails(): void {
    this.isLoading = true;
    this.caseService.getCaseById(this.caseId).subscribe({
      next: (data) => {
        this.caseDetails = data;
        this.initForm();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load case details', err);
        this.isLoading = false;
      }
    });
  }

  initForm(): void {
    if (!this.caseDetails) return;
    const isFreeze = this.isFreezeOrder();
    
    this.responseForm = this.fb.group({
      remarks: ['', [Validators.required, Validators.maxLength(500)]],
      freezeAmountApplied: [
        null, 
        isFreeze ? [Validators.required, Validators.min(0)] : []
      ],
      balanceReported: [
        this.caseDetails.validationResult?.currentBalance || null, 
        !isFreeze ? [Validators.required, Validators.min(0)] : []
      ]
    });
  }

  isFreezeOrder(): boolean {
    return this.caseDetails?.orderType === 'FreezeAccount' || this.caseDetails?.orderType === 0;
  }

  isAwaitingResponse(): boolean {
    return this.caseDetails?.status === 'AccountValidated' || this.caseDetails?.status === 1;
  }

  isTerminalState(): boolean {
    if (!this.caseDetails) return false;
    const status = this.caseDetails.status;
    return !!this.caseDetails.response ||
      status === 'AccountNotFound' || status === 2 ||
      status === 'FreezeApplied' || status === 4 ||
      status === 'BalanceProvided' || status === 5;
  }

  isPendingState(): boolean {
    return this.caseDetails?.status === 'Pending' || this.caseDetails?.status === 0;
  }

  getDownloadUrl(filePath: string): string {
    if (!filePath) return '#';
    // If it is a relative path, prefix it with backend host url
    if (filePath.startsWith('/')) {
      return `${this.apiUrl}${filePath}`;
    }
    return filePath;
  }

  onSubmit(): void {
    if (this.responseForm.invalid) {
      this.responseForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formVal = this.responseForm.value;
    const responseType = this.isFreezeOrder() ? 'FreezeApplied' : 'BalanceProvided';

    const payload = {
      responseType: responseType,
      remarks: formVal.remarks,
      freezeAmountApplied: this.isFreezeOrder() ? formVal.freezeAmountApplied : null,
      balanceReported: !this.isFreezeOrder() ? formVal.balanceReported : null
    };

    this.caseService.submitResponse(this.caseId, payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Response submitted successfully.');
        this.router.navigate(['/bank/cases']);
      },
      error: (err) => {
        this.isSubmitting = false;
        alert(err.error?.message || 'Failed to submit response.');
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}