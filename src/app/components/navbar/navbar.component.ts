/*
 * File: navbar.component.ts
 * Description: Standalone header navigation bar component displaying navigation tabs and sign out controls.
 * To Implement: Keep styles centered.
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary" class="ccms-navbar">
      <span>CCMS - Legal Orders Portal</span>
      
      <span class="spacer"></span>
      
      <ng-container *ngIf="authService.currentUser$ | async as user">
        <button mat-button *ngIf="user.role === 'CourtOfficer'" routerLink="/court/dashboard">
          Court Dashboard
        </button>
        <button mat-button *ngIf="user.role === 'BankOfficer'" routerLink="/bank/dashboard">
          Bank Dashboard
        </button>
        <button mat-button *ngIf="user.role === 'BankOfficer'" routerLink="/bank/cases">
          Case Inbox
        </button>
        
        <span class="user-greeting">Hello, {{ user.username }} ({{ user.role }})</span>
        
        <button mat-raised-button color="accent" (click)="onLogout()">Logout</button>
      </ng-container>
    </mat-toolbar>
  `,
  styles: [`
    .ccms-navbar {
      display: flex;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .spacer {
      flex: 1 1 auto;
    }
    .user-greeting {
      font-size: 14px;
      margin: 0 16px;
      font-weight: 300;
    }
  `]
})
export class NavbarComponent {
  public authService = inject(AuthService);

  onLogout(): void {
    this.authService.logout();
  }
}
