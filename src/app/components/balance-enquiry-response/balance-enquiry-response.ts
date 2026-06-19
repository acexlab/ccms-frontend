import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CaseService } from '../../services/case.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService } from '../../services/notification.service';
import { LoadingButtonComponent } from '../loading-button/loading-button.component';

@Component({
  selector: 'app-balance-enquiry-response',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule, MatProgressSpinnerModule, LoadingButtonComponent],
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

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly caseService = inject(CaseService);
  private readonly notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.caseNumber = this.route.snapshot.paramMap.get('caseNumber') || '';
    if (this.caseNumber) {
      this.loadCaseDetails();
    }
  }

  loadCaseDetails(): void {
    this.caseService.getCaseDetails(this.caseNumber).subscribe({
      next: (data) => {
        if (data.status !== 'AccountValidated' && data.status !== 'UnderReview') {
          // Prevent access to already responded cases (only allow AccountValidated or UnderReview)
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
    return this.verifiedBalance !== null && this.verifiedBalance >= 0;
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
        this.notificationService.success('Balance Response submitted successfully.');
        setTimeout(() => {
          this.isSubmitting = false;
          this.router.navigate(['/bank/cases'], { state: { activeTab: 2 } });
        }, 400);
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 409) {
          this.submitError = 'A response has already been submitted for this case.';
        } else {
          this.submitError = 'Submission failed. Please try again.';
        }
        this.notificationService.error(this.submitError);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/bank/cases']);
  }
}
