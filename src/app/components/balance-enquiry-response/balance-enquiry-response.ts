import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CaseService } from '../../services/case.service';

@Component({
  selector: 'app-balance-enquiry-response',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './balance-enquiry-response.html',
  styleUrls: ['./balance-enquiry-response.scss']
})
export class BalanceEnquiryResponse implements OnInit {
  caseNumber: string = '';
  caseDetails: any = null;
  
  verifiedBalance: number = 0;
  remarks: string = '';

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
          this.router.navigate(['/bank/inbox']);
          return;
        }
        this.caseDetails = data;
        this.verifiedBalance = data.currentBalance || 0;
      },
      error: (err) => console.error(err)
    });
  }

  submitResponse(): void {
    const payload = {
      responseType: 'BalanceProvided',
      balanceReported: this.verifiedBalance,
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
