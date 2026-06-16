import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-bank-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="welcome-card">
      <h1>Welcome, Bank Officer!</h1>
      <p>This is a sample Bank Dashboard proving redirection works successfully.</p>
      <div class="status-indicator">
        <span class="dot active"></span>
        <span class="status-text">Connection Secure: Local MySQL DB</span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100%;
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
  // No methods needed now
}