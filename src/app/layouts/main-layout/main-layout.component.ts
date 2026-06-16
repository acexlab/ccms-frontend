import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, MatIconModule, MatMenuModule, MatDialogModule],
  template: `
    <div class="min-h-screen bg-[#f8fafc] flex flex-col text-slate-800 font-sans">
      <!-- Top Navigation Bar -->
      <header class="bg-white/85 backdrop-blur-md border-b border-slate-100 h-16 flex items-center justify-between px-8 fixed top-0 left-0 right-0 z-50 shadow-sm transition-all duration-355">
        
        <!-- Left Section: ⚖ CCMS Judicial Management Portal -->
        <div class="flex items-center gap-3 w-1/4">
          <div class="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <span class="text-white text-lg font-bold leading-none">⚖</span>
          </div>
          <div>
            <h1 class="text-primary text-xl font-bold tracking-tight m-0 leading-none">CCMS</h1>
            <p class="text-[8px] text-gray-500 font-semibold m-0 leading-none mt-1 uppercase tracking-wider">Judicial Management Portal</p>
          </div>
        </div>

        <!-- Center Section: Main Navigation Links -->
        <nav class="flex items-center gap-4 justify-center flex-1">
          <!-- Court Links -->
          <ng-container *ngIf="role === 'Court'">
            <a routerLink="/court/dashboard" routerLinkActive="active-nav-link" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
              <span class="material-symbols-outlined text-base">dashboard</span>
              Dashboard
            </a>
            <a routerLink="/court/dashboard" fragment="cases-section" routerLinkActive="active-nav-link" class="nav-link">
              <span class="material-symbols-outlined text-base">gavel</span>
              Cases
            </a>
            <a routerLink="/court/create-case" routerLinkActive="active-nav-link" class="nav-link">
              <span class="material-symbols-outlined text-base">add_box</span>
              Create Case
            </a>
          </ng-container>

          <!-- Bank Links -->
          <ng-container *ngIf="role === 'Bank'">
            <a routerLink="/bank/dashboard" routerLinkActive="active-nav-link" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
              <span class="material-symbols-outlined text-base">dashboard</span>
              Dashboard
            </a>
            <a routerLink="/bank/cases" routerLinkActive="active-nav-link" class="nav-link">
              <span class="material-symbols-outlined text-base">inbox</span>
              Bank Inbox
            </a>
            <a routerLink="/bank/batch-processing" routerLinkActive="active-nav-link" class="nav-link">
              <span class="material-symbols-outlined text-base">layers</span>
              Batch History
            </a>
          </ng-container>
        </nav>

        <!-- Right Section: User Profile Dropdown -->
        <div class="flex items-center gap-4 w-1/4 justify-end">
          <button [matMenuTriggerFor]="profileMenu" class="flex items-center gap-2.5 text-left hover:bg-slate-50 p-1.5 rounded-xl transition-all cursor-pointer">
            <div class="hidden sm:block text-right">
              <p class="text-xs font-bold text-gray-900 leading-tight m-0">{{ username }}</p>
              <p class="text-[9px] text-gray-500 font-semibold m-0 mt-0.5 uppercase tracking-wider">{{ role === 'Court' ? 'Court Officer' : 'Bank Officer' }}</p>
            </div>
            <div class="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-xs shadow-sm border border-blue-100">
              {{ (username?.substring(0, 2) || 'US').toUpperCase() }}
            </div>
            <span class="material-symbols-outlined text-slate-400 text-xs">expand_more</span>
          </button>

          <mat-menu #profileMenu="matMenu" class="!rounded-xl !shadow-lg !border !border-slate-100 !mt-2">
            <button mat-menu-item class="!text-sm !font-semibold !text-slate-700" (click)="showProfileInfo()">
              <mat-icon class="!text-slate-500 !text-lg">person</mat-icon>
              <span>Profile</span>
            </button>
            <button mat-menu-item class="!text-sm !font-semibold !text-slate-700" (click)="showChangePasswordInfo()">
              <mat-icon class="!text-slate-500 !text-lg">lock</mat-icon>
              <span>Change Password</span>
            </button>
            <hr class="border-slate-100 my-1"/>
            <button mat-menu-item class="!text-sm !font-semibold !text-red-650" (click)="confirmLogout()">
              <mat-icon class="!text-red-500 !text-lg">logout</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        </div>
      </header>

      <!-- Main Portal Content -->
      <main class="flex-1 pt-16 overflow-y-auto bg-slate-50/50">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .nav-link {
      position: relative;
      padding: 0.5rem 1rem;
      border-radius: 0.75rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #4b5563;
      transition: all 0.2s ease-in-out;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
    }
    .nav-link:hover {
      background-color: #f1f5f9;
      color: #0f172a;
    }
    .active-nav-link {
      background-color: #e8effd !important;
      color: #0b2265 !important;
      font-weight: 600 !important;
    }
    .active-nav-link::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 15%;
      width: 70%;
      height: 3px;
      background-color: #0b2265;
      border-radius: 9999px;
      animation: slideIn 0.2s ease-out;
    }
    @keyframes slideIn {
      from { transform: scaleX(0); }
      to { transform: scaleX(1); }
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);

  role: string | null = null;
  username: string | null = null;

  ngOnInit(): void {
    this.role = this.authService.getUserRole();
    this.username = this.authService.getUsername();
  }

  showProfileInfo(): void {
    this.notificationService.info(`Profile details for ${this.username}`);
  }

  showChangePasswordInfo(): void {
    this.notificationService.info('Change Password options are managed by your institution.');
  }

  confirmLogout(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '380px',
      data: {
        title: 'Confirm Logout',
        message: 'Are you sure you want to sign out from the Judicial Portal?',
        confirmText: 'Logout',
        cancelText: 'Cancel',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onLogout();
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.notificationService.success('Logged out successfully');
    this.router.navigate(['/login']);
  }
}
