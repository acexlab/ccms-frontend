import { Routes } from '@angular/router';
import { courtGuard } from './authguard/court.guard';
import { bankGuard } from './authguard/bank.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) 
  },
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
    path: 'court/cases/:id', 
    loadComponent: () => import('./components/court-case-detail/court-case-detail.component').then(m => m.CourtCaseDetailComponent),
    canActivate: [courtGuard]
  },
  { 
    path: 'bank', 
    loadComponent: () => import('./layouts/bank-layout/bank-layout').then(m => m.BankLayout),
    canActivate: [bankGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      { 
        path: 'cases', 
        loadComponent: () => import('./components/case-inbox/case-inbox.component').then(m => m.CaseInboxComponent)
      },
      { 
        path: 'cases/:caseNumber', 
        loadComponent: () => import('./components/bank-case-detail/bank-case-detail.component').then(m => m.BankCaseDetailComponent)
      },
      { 
        path: 'cases/:caseNumber/balance-response', 
        loadComponent: () => import('./components/balance-enquiry-response/balance-enquiry-response').then(m => m.BalanceEnquiryResponse)
      },
      { 
        path: 'cases/:caseNumber/freeze-response', 
        loadComponent: () => import('./components/freeze-account-response/freeze-account-response').then(m => m.FreezeAccountResponse)
      },
      { 
        path: 'batch-processing', 
        loadComponent: () => import('./components/batch-processing/batch-processing.component').then(m => m.BatchProcessingComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
