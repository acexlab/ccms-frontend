import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CaseService } from '../../services/case.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-balance-enquiry-response',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './balance-enquiry-response.html',
  styleUrls: ['./balance-enquiry-response.scss']
})
export class BalanceEnquiryResponse implements OnInit {
  caseNumber: string = '';
  caseDetails: any = null;
  
  verifiedBalance: number | null = null;
  remarks: string = '';
  minutesAgo: number = 0;

  isSubmitting: boolean = false;
  submitError: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private caseService: CaseService
  ) {}

  ngOnInit(): void {
    this.caseNumber = this.route.snapshot.paramMap.get('caseNumber') || '';
    if (this.caseNumber) {
      this.loadCaseDetails();
    }
  }

  loadCaseDetails(): void {
    this.caseService.getCaseDetails(this.caseNumber).subscribe({
      next: (data) => {
        if (data.status !== 'AccountValidated') {
          // Prevent access to already responded cases
          this.router.navigate(['/bank/cases']);
          return;
        }
        this.caseDetails = data;
        this.verifiedBalance = data.currentBalance || 0;
        
        if (data.validationTimestamp) {
          const diffMs = Date.now() - new Date(data.validationTimestamp).getTime();
          this.minutesAgo = Math.max(0, Math.floor(diffMs / 60000));
        }
      },
      error: (err) => console.error(err)
    });
  }

  get isFormValid(): boolean {
    return this.verifiedBalance !== null && this.verifiedBalance > 0;
  }

  submitResponse(): void {
    if (!this.isFormValid) return;

    this.isSubmitting = true;
    this.submitError = '';

    const payload = {
      responseType: 'BalanceProvided',
      balanceReported: this.verifiedBalance,
      remarks: this.remarks
    };

    this.caseService.submitCaseResponse(this.caseNumber, payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/bank/cases'], { state: { activeTab: 2 } });
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 409) {
          this.submitError = 'A response has already been submitted for this case.';
        } else {
          this.submitError = 'Submission failed. Please try again.';
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/bank/cases']);
  }
}
