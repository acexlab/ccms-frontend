/*
 * File: app.routes.ts
 * Description: Defines the core route configuration and navigation guards.
 * To Implement: Keep guards aligned with token-based role definitions.
 */

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
    path: 'court/cases/new', 
    loadComponent: () => import('./components/create-case/create-case.component').then(m => m.CreateCaseComponent),
    canActivate: [courtGuard]
  },
  { 
    path: 'court/cases/:id', 
    loadComponent: () => import('./components/court-case-detail/court-case-detail.component').then(m => m.CourtCaseDetailComponent),
    canActivate: [courtGuard]
  },
  { 
    path: 'bank/dashboard', 
    loadComponent: () => import('./components/bank-dashboard/bank-dashboard.component').then(m => m.BankDashboardComponent),
    canActivate: [bankGuard]
  },
  { 
    path: 'bank/cases', 
    loadComponent: () => import('./components/case-inbox/case-inbox.component').then(m => m.CaseInboxComponent),
    canActivate: [bankGuard]
  },
  { 
    path: 'bank/cases/:id', 
    loadComponent: () => import('./components/bank-case-detail/bank-case-detail.component').then(m => m.BankCaseDetailComponent),
    canActivate: [bankGuard]
  },
  { path: '**', redirectTo: 'login' }
];
