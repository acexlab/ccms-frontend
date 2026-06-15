import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CaseService } from '../../services/case.service';

@Component({
  selector: 'app-court-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- TopNavBar -->
    <header class="flex justify-between items-center w-full px-margin-desktop sticky top-0 z-50 bg-surface border-b border-outline-variant h-16">
      <div class="flex items-center gap-4">
        <span class="font-headline-md text-headline-md font-bold text-primary">CCMS</span>
        <div class="h-8 w-px bg-outline-variant mx-2"></div>
        <span class="font-title-md text-title-md text-on-surface-variant">Case Registration System</span>
      </div>
      <div class="flex items-center gap-6">
        <div class="relative group">
          <span class="material-symbols-outlined text-on-surface-variant cursor-pointer p-2 hover:bg-surface-container-low rounded-full transition-colors">notifications</span>
          <span class="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
        </div>
        <span class="material-symbols-outlined text-on-surface-variant cursor-pointer p-2 hover:bg-surface-container-low rounded-full transition-colors">account_circle</span>
        <span class="material-symbols-outlined text-on-surface-variant cursor-pointer p-2 hover:bg-surface-container-low rounded-full transition-colors" (click)="onLogout()">logout</span>
      </div>
    </header>

    <div class="flex">
      <!-- SideNavBar -->
      <aside class="w-[280px] h-[calc(100vh-64px)] fixed left-0 top-16 bg-surface-container-lowest border-r border-outline-variant flex flex-col pt-8 pb-md">
        <div class="px-6 mb-8 flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
            <span class="material-symbols-outlined text-on-secondary-container" style="font-variation-settings: 'FILL' 1;">person</span>
          </div>
          <div>
            <p class="font-title-md text-title-md text-on-surface leading-tight">Court Officer</p>
            <p class="font-label-md text-label-md text-on-surface-variant">Legal Division</p>
          </div>
        </div>
        <nav class="flex-1 space-y-1">
          <a class="flex items-center gap-3 py-3 px-6 bg-secondary-container text-on-secondary-container font-bold rounded-full mx-2 transition-all" routerLink="/court/dashboard">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">dashboard</span>
            <span class="font-label-lg text-label-lg">Dashboard</span>
          </a>
          <a class="flex items-center gap-3 py-3 px-6 text-on-surface-variant hover:bg-surface-container-high mx-2 rounded-full transition-all" routerLink="/court/create-case">
            <span class="material-symbols-outlined">add_box</span>
            <span class="font-label-lg text-label-lg">Create Case</span>
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="ml-[280px] flex-1 p-xl">
        <div class="max-w-4xl mx-auto">
          <!-- Header -->
          <div class="mb-xl flex justify-between items-center">
            <div>
              <h1 class="font-headline-lg text-headline-lg text-primary mb-2">Court Dashboard</h1>
              <p class="font-body-lg text-body-lg text-on-surface-variant">Manage and track legal enforcement cases and execution orders.</p>
            </div>
            <button routerLink="/court/create-case" class="px-6 py-3 bg-primary text-white font-label-lg text-label-lg rounded-full shadow-lg hover:shadow-xl hover:bg-primary-container transition-all flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">add</span>
              Register New Case
            </button>
          </div>

          <!-- Quick Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-surface-container-low rounded-xl border border-outline-variant p-5">
              <span class="material-symbols-outlined text-primary text-3xl mb-2">gavel</span>
              <p class="text-sm text-on-surface-variant">Total Registered Cases</p>
              <p class="text-2xl font-bold text-on-surface mt-1">{{ cases.length }}</p>
            </div>
            <div class="bg-surface-container-low rounded-xl border border-outline-variant p-5">
              <span class="material-symbols-outlined text-green-600 text-3xl mb-2">check_circle</span>
              <p class="text-sm text-on-surface-variant">Validated & Completed</p>
              <p class="text-2xl font-bold text-on-surface mt-1">{{ countStatus('AccountValidated') + countStatus('FreezeApplied') + countStatus('BalanceProvided') }}</p>
            </div>
            <div class="bg-surface-container-low rounded-xl border border-outline-variant p-5">
              <span class="material-symbols-outlined text-amber-500 text-3xl mb-2">pending</span>
              <p class="text-sm text-on-surface-variant">Pending Reviews</p>
              <p class="text-2xl font-bold text-on-surface mt-1">{{ countStatus('Pending') }}</p>
            </div>
          </div>

          <!-- Cases List -->
          <div class="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-lg">
            <h2 class="font-title-lg text-title-lg mb-4 text-primary">Registered Enforcement Cases</h2>
            <div *ngIf="isLoading" class="text-center py-8">
              <span class="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
              <p class="text-on-surface-variant text-sm mt-2">Loading cases...</p>
            </div>
            <div *ngIf="!isLoading && cases.length === 0" class="text-center py-12 border border-dashed border-outline-variant rounded-xl bg-surface-container-low">
              <span class="material-symbols-outlined text-outline text-5xl mb-2">folder_open</span>
              <p class="font-title-md text-title-md">No cases registered yet</p>
              <p class="text-on-surface-variant text-sm mt-1">Get started by registering a new judicial enforcement order.</p>
              <button routerLink="/court/create-case" class="mt-4 px-6 py-2 bg-primary text-white rounded-full font-label-lg text-label-lg hover:shadow-lg transition-all">Register First Case</button>
            </div>

            <div *ngIf="!isLoading && cases.length > 0" class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-outline-variant">
                    <th class="py-3 px-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Case Number</th>
                    <th class="py-3 px-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Order Type</th>
                    <th class="py-3 px-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Target Amount</th>
                    <th class="py-3 px-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th class="py-3 px-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Registered At</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let c of cases" class="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                    <td class="py-3 px-4 font-bold text-primary">{{ c.caseNumber }}</td>
                    <td class="py-3 px-4">
                      <span [class]="c.orderType === 'FreezeAccount' ? 'px-2 py-0.5 bg-error-container text-error text-[10px] font-bold rounded uppercase' : 'px-2 py-0.5 bg-secondary-container text-primary text-[10px] font-bold rounded uppercase'">
                        {{ c.orderType === 'FreezeAccount' ? 'Freeze' : 'Enquiry' }}
                      </span>
                    </td>
                    <td class="py-3 px-4 font-bold">{{ c.freezeAmount ? '₹' + c.freezeAmount : 'FULL' }}</td>
                    <td class="py-3 px-4">
                      <span [class]="getStatusClass(c.status)">
                        {{ c.status }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-sm text-on-surface-variant">{{ c.createdAt | date:'mediumDate' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
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
  isLoading = true;

  ngOnInit(): void {
    this.loadCases();
  }

  loadCases(): void {
    this.isLoading = true;
    this.caseService.getMyCases().subscribe({
      next: (data) => {
        this.cases = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  countStatus(status: string): number {
    return this.cases.filter(c => c.status === status).length;
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'Pending':
        return 'px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase';
      case 'AccountValidated':
        return 'px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded uppercase';
      case 'AccountNotFound':
        return 'px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded uppercase';
      case 'FreezeApplied':
      case 'BalanceProvided':
        return 'px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded uppercase';
      default:
        return 'px-2 py-0.5 bg-gray-100 text-gray-800 text-[10px] font-bold rounded uppercase';
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}