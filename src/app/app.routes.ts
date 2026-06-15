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
    path: 'bank/dashboard', 
    loadComponent: () => import('./components/bank-dashboard/bank-dashboard.component').then(m => m.BankDashboardComponent),
    canActivate: [bankGuard]
  },
  { path: '**', redirectTo: 'login' }
];