import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CaseService } from '../../services/case.service';

@Component({
  selector: 'app-court-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Outer Scoped Theme Wrapper -->
    <div class="court-portal min-h-screen bg-gray-50 flex flex-col text-slate-800 font-sans pb-16 md:pb-0">
      <!-- TopNavBar -->
      <header class="flex justify-between items-center w-full px-8 bg-white border-b border-gray-200 h-16 shadow-sm flex-shrink-0 sticky top-0 z-50">
        <div class="flex items-center gap-4">
          <span class="font-bold text-2xl text-primary">CCMS</span>
          <div class="h-8 w-px bg-gray-200 mx-2"></div>
          <span class="text-sm font-medium text-gray-500">Case Registration System</span>
        </div>

        <div class="flex items-center gap-6">
          <!-- Notification Bell with Dot on case update -->
          <div (click)="clearNotification()" class="relative group cursor-pointer p-2 hover:bg-gray-50 rounded-full transition-all">
            <span class="material-symbols-outlined text-gray-600 block">notifications</span>
            <span *ngIf="hasNotificationDot" class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
          
          <button (click)="onLogout()" class="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all font-medium">
            <span class="material-symbols-outlined text-base">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div class="flex flex-1 overflow-hidden">
        <!-- SideNavBar -->
        <aside class="w-64 bg-white border-r border-gray-200 flex flex-col pt-8 pb-6 hidden md:flex flex-shrink-0">
          <div class="px-6 mb-8 flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <span class="material-symbols-outlined text-white text-xl" style="font-variation-settings: 'FILL' 1;">gavel</span>
            </div>
            <div>
              <p class="font-bold text-gray-800 text-sm leading-tight">Court Officer</p>
              <p class="text-xs text-gray-500">Legal Division</p>
            </div>
          </div>
          
          <nav class="flex-1 p-4 space-y-1">
            <a routerLink="/court/dashboard" routerLinkActive="bg-primary-light text-primary" [routerLinkActiveOptions]="{exact: true}" class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors cursor-pointer">
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">dashboard</span>
              <span class="text-sm">Dashboard</span>
            </a>
            <a routerLink="/court/create-case" routerLinkActive="bg-primary-light text-primary" class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors cursor-pointer">
              <span class="material-symbols-outlined">add_box</span>
              <span class="text-sm">Create Case</span>
            </a>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 p-8 overflow-y-auto bg-[#f8fafc]">
          <div class="max-w-6xl mx-auto space-y-8">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 class="text-3xl font-bold text-gray-950 tracking-tight mb-1">Officer Overview</h1>
                <p class="text-sm text-gray-500">Welcome back. You have {{ countStatus('Pending') }} cases requiring immediate action.</p>
              </div>
              <button routerLink="/court/create-case" class="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap">
                <span class="material-symbols-outlined text-base">add</span>
                New Judicial Order
              </button>
            </div>

            <!-- Quick Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <!-- Card 1: Pending Cases -->
              <div class="bg-white rounded-xl border border-gray-200 p-6 relative shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-6">
                  <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pending Cases</span>
                  <span class="material-symbols-outlined text-amber-600 text-lg">schedule</span>
                </div>
                <p class="text-3xl font-extrabold text-gray-800 mt-2">{{ countStatus('Pending') }}</p>
                <div class="mt-3">
                  <span class="inline-block px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md border border-amber-200">+12% vs last week</span>
                </div>
              </div>

              <!-- Card 2: Account Validated -->
              <div class="bg-white rounded-xl border border-gray-200 p-6 relative shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-6">
                  <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Account Validated</span>
                  <span class="material-symbols-outlined text-blue-600 text-lg">verified</span>
                </div>
                <p class="text-3xl font-extrabold text-gray-800 mt-2">{{ countStatus('AccountValidated') }}</p>
                <div class="mt-3">
                  <span class="inline-block px-2 py-0.5 bg-blue-50 text-[#1e40af] text-[10px] font-bold rounded-md border border-blue-200">Steady activity</span>
                </div>
              </div>

              <!-- Card 3: Freeze Applied -->
              <div class="bg-white rounded-xl border border-gray-200 p-6 relative shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-6">
                  <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Freeze Applied</span>
                  <span class="material-symbols-outlined text-green-600 text-lg" style="font-variation-settings: 'FILL' 1;">ac_unit</span>
                </div>
                <p class="text-3xl font-extrabold text-gray-800 mt-2">{{ countStatus('FreezeApplied') }}</p>
                <div class="mt-3">
                  <span class="inline-block px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-md border border-green-200">8 Active today</span>
                </div>
              </div>

              <!-- Card 4: Balance Provided -->
              <div class="bg-white rounded-xl border border-gray-200 p-6 relative shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-6">
                  <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Balance Provided</span>
                  <span class="material-symbols-outlined text-green-600 text-lg">payments</span>
                </div>
                <p class="text-3xl font-extrabold text-gray-800 mt-2">{{ countStatus('BalanceProvided') }}</p>
                <div class="mt-3">
                  <span class="inline-block px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-md border border-green-200">Target achieved</span>
                </div>
              </div>

              <!-- Card 5: Account Not Found -->
              <div class="bg-white rounded-xl border border-gray-200 p-6 relative shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-6">
                  <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Account Not Found</span>
                  <span class="material-symbols-outlined text-red-600 text-lg">warning</span>
                </div>
                <p class="text-3xl font-extrabold text-gray-800 mt-2">{{ countStatus('AccountNotFound') }}</p>
                <div class="mt-3">
                  <span class="inline-block px-2 py-0.5 bg-red-50 text-red-700 text-[10px] font-bold rounded-md border border-red-200">Requires review</span>
                </div>
              </div>
            </div>

            <!-- Cases List -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
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
              
              <div *ngIf="!isLoading && filteredCases.length === 0" class="text-center py-12 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                <span class="material-symbols-outlined text-gray-400 text-5xl mb-2">folder_open</span>
                <p class="font-semibold text-gray-700">No matching cases found</p>
                <p class="text-gray-500 text-xs mt-1">Try adjusting your search query or status filter.</p>
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
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let c of filteredCases" class="border-b border-gray-100 hover:bg-gray-50/50 transition-all">
                      <td class="py-4 px-4 font-bold text-primary hover:underline cursor-pointer">
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
                      <td class="py-4 px-4 text-sm text-gray-500">{{ c.createdAt | date:'yyyy-MM-dd' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>

      <!-- Bottom Navigation Bar for Mobile -->
      <div class="md:hidden bg-white border-t border-gray-200 h-16 fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-4">
        <a routerLink="/court/dashboard" routerLinkActive="text-primary font-bold" [routerLinkActiveOptions]="{exact: true}" class="flex flex-col items-center justify-center text-gray-500 hover:text-gray-900 transition-colors">
          <span class="material-symbols-outlined text-xl">dashboard</span>
          <span class="text-[10px] mt-0.5">Dashboard</span>
        </a>
        <a routerLink="/court/create-case" routerLinkActive="text-primary font-bold" class="flex flex-col items-center justify-center text-gray-500 hover:text-gray-900 transition-colors">
          <span class="material-symbols-outlined text-xl">add_box</span>
          <span class="text-[10px] mt-0.5">Create Case</span>
        </a>
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
        return 'px-2.5 py-1 bg-red-100 text-red-800 text-[10px] font-extrabold rounded uppercase tracking-wider border border-red-200/50 shadow-sm';
      case 'underreview':
        return 'px-2.5 py-1 bg-purple-100 text-purple-800 text-[10px] font-extrabold rounded uppercase tracking-wider border border-purple-200/50 shadow-sm';
      case 'freezeapplied':
        return 'px-2.5 py-1 bg-rose-100 text-rose-800 text-[10px] font-extrabold rounded uppercase tracking-wider border border-rose-200/50 shadow-sm';
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