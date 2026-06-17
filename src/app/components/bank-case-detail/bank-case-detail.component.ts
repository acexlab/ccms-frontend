import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CaseService } from '../../services/case.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bank-case-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  templateUrl: './bank-case-detail.component.html',
  styleUrls: ['./bank-case-detail.component.scss']
})
export class BankCaseDetailComponent implements OnInit {
  caseDetails: any = null;
  caseNumber: string = '';
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
      next: (data) => this.caseDetails = data,
      error: (err) => console.error('Error loading case details', err)
    });
  }

  downloadDocument(doc: any): void {
    this.caseService.downloadDocument(this.caseNumber, doc.id).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fileName || 'document';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  previewDocument(doc: any): void {
    this.caseService.downloadDocument(this.caseNumber, doc.id).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    });
  }

  navigateToResponse(): void {
    if (this.caseDetails?.orderType === 'FreezeAccount') {
      this.router.navigate(['/bank/cases', this.caseNumber, 'freeze-response']);
    } else if (this.caseDetails?.orderType === 'BalanceEnquiry') {
      this.router.navigate(['/bank/cases', this.caseNumber, 'balance-response']);
    }
  }

  get isAwaitingAction(): boolean {
    return this.caseDetails?.status === 'AccountValidated';
  }

  get isResponded(): boolean {
    return this.caseDetails?.status === 'FreezeApplied' || 
           this.caseDetails?.status === 'BalanceProvided' || 
           this.caseDetails?.status === 'AccountNotFound';
  }
}
