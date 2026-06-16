import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CaseService } from '../../services/case.service';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

@Component({
  selector: 'app-court-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, EmptyStateComponent],
  template: `
    <div class="p-8">
      <div class="max-w-6xl mx-auto space-y-8">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-950 tracking-tight mb-1">Officer Overview</h1>
            <p class="text-sm text-gray-500">Welcome back. You have {{ countStatus('Pending') }} cases requiring immediate action.</p>
          </div>
          <button routerLink="/court/create-case" class="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap cursor-pointer">
            <span class="material-symbols-outlined text-base">add</span>
            New Judicial Order
          </button>
        </div>

        <!-- Quick Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <!-- Card 1: Pending Cases -->
          <div class="stat-card p-6 relative border-t-4 border-orange-500 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-4">
                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pending</span>
                <span class="material-symbols-outlined text-orange-600 text-lg">schedule</span>
              </div>
              <p class="text-3xl font-extrabold text-gray-800 mt-2">{{ countStatus('Pending') }}</p>
            </div>
            <p class="text-[10px] text-gray-500 font-semibold leading-tight mt-3">{{ countStatus('Pending') }} cases awaiting batch validation</p>
          </div>

          <!-- Card 2: Account Validated -->
          <div class="stat-card p-6 relative border-t-4 border-blue-500 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-4">
                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Account Validated</span>
                <span class="material-symbols-outlined text-blue-600 text-lg">verified</span>
              </div>
              <p class="text-3xl font-extrabold text-gray-800 mt-2">{{ countStatus('AccountValidated') }}</p>
            </div>
            <p class="text-[10px] text-gray-500 font-semibold leading-tight mt-3">{{ countStatus('AccountValidated') }} cases awaiting bank action</p>
          </div>

          <!-- Card 3: Freeze Applied -->
          <div class="stat-card p-6 relative border-t-4 border-red-500 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-4">
                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Freeze Applied</span>
                <span class="material-symbols-outlined text-red-500 text-lg" style="font-variation-settings: 'FILL' 1;">ac_unit</span>
              </div>
              <p class="text-3xl font-extrabold text-gray-800 mt-2">{{ countStatus('FreezeApplied') }}</p>
            </div>
            <p class="text-[10px] text-gray-500 font-semibold leading-tight mt-3">{{ countStatus('FreezeApplied') }} completed freeze orders</p>
          </div>

          <!-- Card 4: Balance Provided -->
          <div class="stat-card p-6 relative border-t-4 border-green-500 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-4">
                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Balance Provided</span>
                <span class="material-symbols-outlined text-green-600 text-lg">payments</span>
              </div>
              <p class="text-3xl font-extrabold text-gray-800 mt-2">{{ countStatus('BalanceProvided') }}</p>
            </div>
            <p class="text-[10px] text-gray-500 font-semibold leading-tight mt-3">{{ countStatus('BalanceProvided') }} completed balance responses</p>
          </div>

          <!-- Card 5: Account Not Found -->
          <div class="stat-card p-6 relative border-t-4 border-gray-400 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-4">
                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Account Not Found</span>
                <span class="material-symbols-outlined text-gray-500 text-lg">warning</span>
              </div>
              <p class="text-3xl font-extrabold text-gray-800 mt-2">{{ countStatus('AccountNotFound') }}</p>
            </div>
            <p class="text-[10px] text-gray-500 font-semibold leading-tight mt-3">{{ countStatus('AccountNotFound') }} automatically resolved cases</p>
          </div>
        </div>

        <!-- Cases List -->
        <div class="stat-card p-6">
          <!-- Table Header with Search Bar and Status Filter Option -->
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 class="text-lg font-bold text-gray-900">Recent Judicial Cases</h2>
            
            <!-- Search & Filter Controls -->
            <div class="flex flex-wrap items-center gap-3">
              <!-- Search Input -->
              <div class="relative w-64">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">search</span>
                <input type="text" [(ngModel)]="searchQuery" (input)="onSearchOrFilterChange()" placeholder="Search cases (No., Name, Type)..." class="w-full bg-[#f8fafc] border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"/>
              </div>

              <!-- Status Filter Select -->
              <div class="relative">
                <select [(ngModel)]="selectedStatus" (change)="onSearchOrFilterChange()" class="appearance-none bg-[#f8fafc] border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-xs text-gray-700 font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer">
                  <option value="">All Statuses</option>
                  <option value="Pending">PENDING</option>
                  <option value="AccountValidated">ACCOUNT VALIDATED</option>
                  <option value="UnderReview">UNDER REVIEW</option>
                  <option value="FreezeApplied">FREEZE APPLIED</option>
                  <option value="BalanceProvided">BALANCE PROVIDED</option>
                  <option value="AccountNotFound">ACCOUNT NOT FOUND</option>
                </select>
                <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>

          <div *ngIf="isLoading" class="text-center py-8">
            <span class="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
            <p class="text-gray-500 text-sm mt-2">Loading cases...</p>
          </div>
          
          <div *ngIf="!isLoading && filteredCases.length === 0" class="my-4">
            <app-empty-state
              icon="folder_open"
              title="No Cases Found"
              description="No judicial cases available matching your query. Create a new case to begin."
              actionText="Create Case"
              (actionClicked)="navigateToCreateCase()"
            ></app-empty-state>
          </div>

          <div *ngIf="!isLoading && filteredCases.length > 0" class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-gray-200 bg-gray-50/50">
                  <th class="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Case Number</th>
                  <th class="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Defendant Name</th>
                  <th class="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order Type</th>
                  <th class="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Created Date</th>
                  <th class="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let c of filteredCases" 
                    class="border-b border-gray-100 hover:bg-[#e8effd]/35 transition-all cursor-pointer"
                    [routerLink]="['/court/cases', c.caseNumber]">
                  <td class="py-4 px-4 font-bold text-primary">
                    {{ c.caseNumber }}
                  </td>
                  <td class="py-4 px-4 text-gray-800 font-medium">{{ c.defendantName }}</td>
                  <td class="py-4 px-4 text-gray-500 text-sm">
                    {{ c.orderType === 'FreezeAccount' || c.orderType === 'Freeze' ? 'Account Freeze' : 'Balance Enquiry' }}
                  </td>
                  <td class="py-4 px-4">
                    <span [class]="getStatusClass(c.status)">
                      {{ formatStatus(c.status) }}
                    </span>
                  </td>
                  <td class="py-4 px-4 text-sm text-gray-500">{{ c.createdAt | date:'yyyy-MM-dd HH:mm:ss':'+0530' }} IST</td>
                  <td class="py-4 px-4 text-right">
                    <button [routerLink]="['/court/cases', c.caseNumber]" class="text-xs font-bold text-primary hover:text-primary-hover px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-all cursor-pointer">
                      View Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
  `]
})
export class CourtDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly caseService = inject(CaseService);
  private readonly router = inject(Router);

  cases: any[] = [];
  filteredCases: any[] = [];
  isLoading = true;

  hasNotificationDot = false;
  searchQuery = '';
  selectedStatus = '';

  ngOnInit(): void {
    this.loadCases();
  }

  loadCases(): void {
    this.isLoading = true;
    this.caseService.getMyCases().subscribe({
      next: (data) => {
        this.cases = data;
        this.checkStatusUpdates(data);
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  navigateToCreateCase(): void {
    this.router.navigate(['/court/create-case']);
  }

  checkStatusUpdates(currentCases: any[]): void {
    const stored = localStorage.getItem('ccms_cases_cache');
    if (!stored) {
      const cache: Record<string, string> = {};
      for (const c of currentCases) {
        cache[c.caseNumber] = c.status;
      }
      localStorage.setItem('ccms_cases_cache', JSON.stringify(cache));
      this.hasNotificationDot = false;
      return;
    }

    try {
      const lastKnown = JSON.parse(stored) as Record<string, string>;
      let hasChanges = false;
      for (const c of currentCases) {
        const lastStatus = lastKnown[c.caseNumber];
        if (lastStatus && lastStatus.toLowerCase() !== c.status.toLowerCase()) {
          hasChanges = true;
        }
      }
      this.hasNotificationDot = hasChanges;
    } catch (e) {
      this.hasNotificationDot = false;
    }
  }

  clearNotification(): void {
    this.hasNotificationDot = false;
    const cache: Record<string, string> = {};
    for (const c of this.cases) {
      cache[c.caseNumber] = c.status;
    }
    localStorage.setItem('ccms_cases_cache', JSON.stringify(cache));
  }

  onSearchOrFilterChange(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    let result = [...this.cases];

    if (this.selectedStatus) {
      result = result.filter(c => c.status && c.status.toLowerCase() === this.selectedStatus.toLowerCase());
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(c => 
        (c.caseNumber && c.caseNumber.toLowerCase().includes(q)) ||
        (c.defendantName && c.defendantName.toLowerCase().includes(q)) ||
        (c.orderType && (c.orderType === 'FreezeAccount' || c.orderType === 'Freeze' ? 'account freeze' : 'balance enquiry').includes(q))
      );
    }

    this.filteredCases = result;
  }

  countStatus(status: string): number {
    return this.cases.filter(c => c.status && c.status.toLowerCase() === status.toLowerCase()).length;
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

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}