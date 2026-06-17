import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CaseService } from '../../services/case.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-court-case-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './court-case-detail.component.html',
  styleUrls: ['./court-case-detail.component.scss']
})
export class CourtCaseDetailComponent implements OnInit {
  caseDetails: any = null;
  caseNumber: string = '';
  courtOrderDoc: any = null;
  courtOrderUrl: SafeResourceUrl | null = null;
  isPdfLoading = true;
  isPdfError = false;
  pdfErrorMessage = '';
  errorMessage = '';

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
    this.isPdfLoading = true;
    this.errorMessage = '';
    this.caseService.getCaseDetails(this.caseNumber).subscribe({
      next: (data) => {
        this.caseDetails = data;
        this.courtOrderDoc = data.documents?.find((d: any) => d.documentType === 'CourtOrder');
        if (this.courtOrderDoc) {
          this.caseService.downloadDocument(this.caseNumber, this.courtOrderDoc.id).subscribe({
            next: (blob) => {
              if (blob.size < 100) {
                // Likely a stub/dummy file, not a real document
                this.isPdfError = true;
                this.pdfErrorMessage = 'Document not available in storage.';
                this.isPdfLoading = false;
                return;
              }
              const url = window.URL.createObjectURL(blob);
              this.courtOrderUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
              this.isPdfLoading = false;
            },
            error: (err) => {
              console.error('Error loading pdf preview', err);
              this.isPdfError = true;
              this.pdfErrorMessage = err.status === 404 ? 'Document file not found in storage.' : 'Failed to load document preview.';
              this.isPdfLoading = false;
            }
          });
        } else {
          this.isPdfLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading case details', err);
        this.errorMessage = 'Failed to load case details. You may not have permission to view this case.';
        this.isPdfLoading = false;
      }
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

  getStatusClass(status: string): string {
    if (!status) return 'px-2.5 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold rounded uppercase tracking-wider';
    switch(status.toLowerCase()) {
      case 'pending':
        return 'px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded uppercase tracking-wider border border-amber-200/50 shadow-sm';
      case 'accountvalidated':
        return 'px-2.5 py-1 bg-blue-100 text-blue-800 text-[10px] font-extrabold rounded uppercase tracking-wider border border-blue-200/50 shadow-sm';
      case 'accountnotfound':
        return 'px-2.5 py-1 bg-gray-100 text-gray-800 text-[10px] font-extrabold rounded uppercase tracking-wider border border-gray-200/50 shadow-sm';
      case 'underreview':
        return 'px-2.5 py-1 bg-purple-100 text-purple-800 text-[10px] font-extrabold rounded uppercase tracking-wider border border-purple-200/50 shadow-sm';
      case 'freezeapplied':
        return 'px-2.5 py-1 bg-red-100 text-red-800 text-[10px] font-extrabold rounded uppercase tracking-wider border border-red-200/50 shadow-sm';
      case 'balanceprovided':
        return 'px-2.5 py-1 bg-green-100 text-green-800 text-[10px] font-extrabold rounded uppercase tracking-wider border border-green-200/50 shadow-sm';
      default:
        return 'px-2.5 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold rounded uppercase tracking-wider';
    }
  }

  formatStatus(status: string): string {
    if (!status) return '';
    switch(status.toLowerCase()) {
      case 'pending':
        return 'PENDING';
      case 'accountvalidated':
        return 'ACCOUNT VALIDATED';
      case 'accountnotfound':
        return 'ACCOUNT NOT FOUND';
      case 'underreview':
        return 'UNDER REVIEW';
      case 'freezeapplied':
        return 'FREEZE APPLIED';
      case 'balanceprovided':
        return 'BALANCE PROVIDED';
      default:
        return status.toUpperCase();
    }
  }
}