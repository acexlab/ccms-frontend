import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CaseService } from '../../services/case.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService } from '../../services/notification.service';
import { LoadingButtonComponent } from '../loading-button/loading-button.component';

@Component({
  selector: 'app-freeze-account-response',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule, MatProgressSpinnerModule, LoadingButtonComponent],
  templateUrl: './freeze-account-response.html',
  styleUrls: ['./freeze-account-response.scss']
})
export class FreezeAccountResponse implements OnInit {
  caseNumber: string = '';
  caseDetails: any = null;
  courtOrderDoc: any = null;
  courtOrderUrl: SafeResourceUrl | null = null;
  
  freezeAmount: number | null = null;
  remarks: string = '';

  isPdfLoading: boolean = true;
  isSubmitting: boolean = false;
  submitError: string = '';

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly caseService = inject(CaseService);
  private readonly sanitizer = inject(DomSanitizer);
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
          // Prevent access to already responded cases (only allow ActionValidated or UnderReview)
          this.router.navigate(['/bank/cases']);
          return;
        }
        this.caseDetails = data;
        this.courtOrderDoc = data.documents?.find((d: any) => d.documentType === 'CourtOrder');
        if (this.courtOrderDoc) {
          this.caseService.downloadDocument(this.caseNumber, this.courtOrderDoc.id).subscribe({
            next: (blob) => {
              const url = window.URL.createObjectURL(blob);
              this.courtOrderUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
              this.isPdfLoading = false;
            },
            error: (err) => {
              console.error('Error loading pdf preview', err);
              this.isPdfLoading = false;
            }
          });
        } else {
          this.isPdfLoading = false; // no PDF to load
        }
      },
      error: (err) => console.error(err)
    });
  }

  onPdfLoad(): void {
    this.isPdfLoading = false;
  }

  downloadDocument(): void {
    if (this.courtOrderDoc) {
      this.caseService.downloadDocument(this.caseNumber, this.courtOrderDoc.id).subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.courtOrderDoc.fileName || 'court-order.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
    }
  }

  get isFormValid(): boolean {
    return this.freezeAmount !== null && this.freezeAmount >= 0 && !this.isPdfLoading;
  }

  submitResponse(): void {
    if (!this.isFormValid) return;

    this.isSubmitting = true;
    this.submitError = '';

    const payload = {
      responseType: 'FreezeApplied',
      freezeAmountApplied: this.freezeAmount,
      remarks: this.remarks
    };

    this.caseService.submitCaseResponse(this.caseNumber, payload).subscribe({
      next: () => {
        this.notificationService.success('Account Freeze Response submitted successfully.');
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
