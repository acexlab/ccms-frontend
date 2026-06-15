import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CaseService } from '../../services/case.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-freeze-account-response',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private caseService: CaseService,
    private sanitizer: DomSanitizer
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
          this.router.navigate(['/bank/inbox']);
          return;
        }
        this.caseDetails = data;
        this.courtOrderDoc = data.documents?.find((d: any) => d.documentType === 'CourtOrder');
        if (this.courtOrderDoc) {
          // For demo, we assume the API provides a reliable download stream
          const url = `/api/cases/${this.caseNumber}/documents/${this.courtOrderDoc.id}/download`;
          this.courtOrderUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }
      },
      error: (err) => console.error(err)
    });
  }

  submitResponse(): void {
    if (this.freezeAmount === null || this.freezeAmount < 0) {
      alert('Please enter a valid freeze amount.');
      return;
    }

    const payload = {
      responseType: 'FreezeApplied',
      freezeAmountApplied: this.freezeAmount,
      remarks: this.remarks
    };

    this.caseService.submitCaseResponse(this.caseNumber, payload).subscribe({
      next: () => {
        this.router.navigate(['/bank/inbox']);
      },
      error: (err) => {
        if (err.status === 409) {
          alert('A response already exists for this case.');
          this.router.navigate(['/bank/inbox']);
        } else {
          console.error(err);
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/bank/inbox']);
  }
}
