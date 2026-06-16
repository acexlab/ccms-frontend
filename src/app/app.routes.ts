import { Routes } from '@angular/router';
import { courtGuard } from './authguard/court.guard';
import { bankGuard } from './authguard/bank.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) 
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { 
        path: 'court/dashboard', 
        loadComponent: () => import('./components/court-dashboard/court-dashboard.component').then(m => m.CourtDashboardComponent),
        canActivate: [courtGuard]
      },
      { 
        path: 'court/create-case', 
        loadComponent: () => import('./components/create-case/create-case.component').then(m => m.CreateCaseComponent),
        canActivate: [courtGuard]
      },
      { 
        path: 'court/cases/:caseNumber', 
        loadComponent: () => import('./components/court-case-detail/court-case-detail.component').then(m => m.CourtCaseDetailComponent),
        canActivate: [courtGuard]
      },
      { 
        path: 'bank/dashboard', 
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [bankGuard]
      },
      { 
        path: 'bank/cases', 
        loadComponent: () => import('./components/case-inbox/case-inbox.component').then(m => m.CaseInboxComponent),
        canActivate: [bankGuard]
      },
      { 
        path: 'bank/cases/:caseNumber', 
        loadComponent: () => import('./components/bank-case-detail/bank-case-detail.component').then(m => m.BankCaseDetailComponent),
        canActivate: [bankGuard]
      },
      { 
        path: 'bank/cases/:caseNumber/balance-response', 
        loadComponent: () => import('./components/balance-enquiry-response/balance-enquiry-response').then(m => m.BalanceEnquiryResponse),
        canActivate: [bankGuard]
      },
      { 
        path: 'bank/cases/:caseNumber/freeze-response', 
        loadComponent: () => import('./components/freeze-account-response/freeze-account-response').then(m => m.FreezeAccountResponse),
        canActivate: [bankGuard]
      },
      { 
        path: 'bank/batch-processing', 
        loadComponent: () => import('./components/batch-processing/batch-processing.component').then(m => m.BatchProcessingComponent),
        canActivate: [bankGuard]
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
