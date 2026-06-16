import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-[#f8fafc] flex flex-col text-slate-800 font-sans">
      <!-- Top Navigation Bar -->
      <header class="bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 flex items-center justify-between px-8 fixed top-0 left-0 right-0 z-50 shadow-sm transition-all duration-300">
        <!-- Left side: Application logo & CCMS title -->
        <div class="flex items-center gap-3 w-1/4">
          <div class="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <span class="material-symbols-outlined text-white text-xl" style="font-variation-settings: 'FILL' 1;">gavel</span>
          </div>
          <div>
            <h1 class="text-primary text-xl font-bold tracking-tight m-0 leading-none">CCMS</h1>
            <p class="text-[9px] text-gray-500 font-semibold m-0 leading-none mt-0.5">JUDICIAL PORTAL</p>
          </div>
        </div>

        <!-- Center: Centered navigation menu items -->
        <nav class="flex items-center gap-2 justify-center flex-1">
          <!-- Court Links -->
          <ng-container *ngIf="role === 'Court'">
            <a routerLink="/court/dashboard" routerLinkActive="bg-primary-light text-primary font-semibold" class="px-4 py-2 hover:bg-slate-100 rounded-xl text-sm text-gray-600 hover:text-gray-900 transition-all duration-200 flex items-center gap-2">
              <span class="material-symbols-outlined text-base">dashboard</span>
              Dashboard
            </a>
            <a routerLink="/court/create-case" routerLinkActive="bg-primary-light text-primary font-semibold" class="px-4 py-2 hover:bg-slate-100 rounded-xl text-sm text-gray-600 hover:text-gray-900 transition-all duration-200 flex items-center gap-2">
              <span class="material-symbols-outlined text-base">add_box</span>
              Create Case
            </a>
          </ng-container>

          <!-- Bank Links -->
          <ng-container *ngIf="role === 'Bank'">
            <a routerLink="/bank/dashboard" routerLinkActive="bg-primary-light text-primary font-semibold" class="px-4 py-2 hover:bg-slate-100 rounded-xl text-sm text-gray-600 hover:text-gray-900 transition-all duration-200 flex items-center gap-2">
              <span class="material-symbols-outlined text-base">dashboard</span>
              Dashboard
            </a>
            <a routerLink="/bank/cases" routerLinkActive="bg-primary-light text-primary font-semibold" class="px-4 py-2 hover:bg-slate-100 rounded-xl text-sm text-gray-600 hover:text-gray-900 transition-all duration-200 flex items-center gap-2">
              <span class="material-symbols-outlined text-base">inbox</span>
              Bank Inbox
            </a>
            <a routerLink="/bank/batch-processing" routerLinkActive="bg-primary-light text-primary font-semibold" class="px-4 py-2 hover:bg-slate-100 rounded-xl text-sm text-gray-600 hover:text-gray-900 transition-all duration-200 flex items-center gap-2">
              <span class="material-symbols-outlined text-base">layers</span>
              Batch History
            </a>
          </ng-container>
        </nav>

        <!-- Right side: User name, Role, Logout -->
        <div class="flex items-center gap-4 w-1/4 justify-end">
          <div class="text-right hidden sm:block">
            <p class="text-xs font-bold text-gray-900 leading-tight m-0">{{ username }}</p>
            <p class="text-[10px] text-gray-500 font-medium m-0 mt-0.5">{{ role === 'Court' ? 'Court Officer' : 'Bank Officer' }}</p>
          </div>
          <div class="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-xs shadow-sm border border-blue-100">
            {{ (username?.substring(0, 2) || 'US').toUpperCase() }}
          </div>
          <button (click)="onLogout()" class="text-gray-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors" title="Logout">
            <span class="material-symbols-outlined text-lg block">logout</span>
          </button>
        </div>
      </header>

      <!-- Main Portal Content -->
      <main class="flex-1 pt-16 overflow-y-auto bg-slate-50/50">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: []
})
export class MainLayoutComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  role: string | null = null;
  username: string | null = null;

  ngOnInit(): void {
    this.role = this.authService.getUserRole();
    this.username = this.authService.getUsername();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
