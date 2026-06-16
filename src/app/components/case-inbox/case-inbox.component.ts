import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CaseService } from '../../services/case.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-case-inbox',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  templateUrl: './case-inbox.component.html',
  styleUrls: ['./case-inbox.component.scss']
})
export class CaseInboxComponent implements OnInit {
  private readonly caseService = inject(CaseService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  cases: any[] = [];
  filteredCases: any[] = [];
  pagedCases: any[] = [];
  searchQuery = '';
  activeTab: 'awaiting' | 'pending' | 'completed' | 'autoresolved' = 'awaiting';
  isLoading = true;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  protected readonly Math = Math;

  // Filtered lists for counts
  awaitingActionCases: any[] = [];
  pendingBatchCases: any[] = [];
  completedCases: any[] = [];
  autoResolvedCases: any[] = [];

  ngOnInit(): void {
    this.loadCases();
  }

  loadCases(): void {
    this.isLoading = true;
    this.caseService.getMyCases().subscribe({
      next: (data) => {
        this.cases = data;
        this.categorizeCases();
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load cases', err);
        this.isLoading = false;
      }
    });
  }

  categorizeCases(): void {
    this.awaitingActionCases = this.cases.filter(c => c.status === 'AccountValidated');
    this.pendingBatchCases = this.cases.filter(c => c.status === 'Pending' || c.status === 'UnderReview');
    this.completedCases = this.cases.filter(c => c.status === 'FreezeApplied' || c.status === 'BalanceProvided');
    this.autoResolvedCases = this.cases.filter(c => c.status === 'AccountNotFound');
  }

  setTab(tab: 'awaiting' | 'pending' | 'completed' | 'autoresolved'): void {
    this.activeTab = tab;
    this.applyFilter();
  }

  applyFilter(): void {
    let list: any[] = [];
    if (this.activeTab === 'awaiting') {
      list = this.awaitingActionCases;
    } else if (this.activeTab === 'pending') {
      list = this.pendingBatchCases;
    } else if (this.activeTab === 'completed') {
      list = this.completedCases;
    } else if (this.activeTab === 'autoresolved') {
      list = this.autoResolvedCases;
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      this.filteredCases = list.filter(c => 
        (c.caseNumber && c.caseNumber.toLowerCase().includes(query)) || 
        (c.defendantName && c.defendantName.toLowerCase().includes(query))
      );
    } else {
      this.filteredCases = list;
    }

    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filteredCases.length / this.pageSize));
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedCases = this.filteredCases.slice(start, start + this.pageSize);
  }

  changePage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPaginationItems(): (number | string)[] {
    const pages: (number | string)[] = [];
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (current > 4) {
      pages.push('...');
    }

    const start = Math.max(2, current - 2);
    const end = Math.min(total - 1, current + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < total - 1) {
      pages.push('...');
    }

    pages.push(total);

    // Filter duplicates
    return pages.filter((item, index) => pages.indexOf(item) === index);
  }

  viewCaseDetails(id: number): void {
    this.router.navigate(['/bank/cases', id]);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}