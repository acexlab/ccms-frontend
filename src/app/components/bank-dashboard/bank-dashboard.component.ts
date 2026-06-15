import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-bank-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="logo">
          <span class="logo-text">CCMS</span>
          <span class="badge">BANK</span>
        </div>
        <button class="logout-btn" (click)="onLogout()">Logout</button>
      </header>

      <main class="dashboard-main">
        <div class="welcome-card">
          <h1>Welcome, Bank Officer!</h1>
          <p>This is a sample Bank Dashboard proving redirection works successfully.</p>
          <div class="status-indicator">
            <span class="dot active"></span>
            <span class="status-text">Connection Secure: Local MySQL DB</span>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background-color: #f1f5f9;
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
    }
    .dashboard-header {
      background-color: #0d9488;
      color: white;
      padding: 16px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-text {
      font-size: 20px;
      font-weight: 700;
    }
    .badge {
      background-color: #0f766e;
      font-size: 11px;
      font-weight: bold;
      padding: 4px 8px;
      border-radius: 4px;
      letter-spacing: 0.5px;
    }
    .logout-btn {
      background-color: transparent;
      border: 1px solid rgba(255, 255, 255, 0.4);
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    .logout-btn:hover {
      background-color: white;
      color: #0d9488;
      border-color: white;
    }
    .dashboard-main {
      flex: 1;
      padding: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .welcome-card {
      background-color: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
      max-width: 500px;
      width: 100%;
      text-align: center;
    }
    .welcome-card h1 {
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 12px;
    }
    .welcome-card p {
      color: #64748b;
      margin-bottom: 24px;
      line-height: 1.6;
    }
    .status-indicator {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background-color: #f0fdf4;
      border: 1px solid #dcfce7;
      color: #15803d;
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
    }
    .dot {
      width: 8px;
      height: 8px;
      background-color: #22c55e;
      border-radius: 50%;
    }
  `]
})
export class BankDashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}