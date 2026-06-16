import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="getBadgeClass()">
      {{ getDisplayStatus() }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-block;
      padding: 0.25em 0.6em;
      font-size: 12px;
      font-weight: 600;
      line-height: 1;
      text-align: center;
      white-space: nowrap;
      vertical-align: baseline;
      border-radius: 4px;
    }
    .badge-awaiting {
      background-color: #fff3cd;
      color: #856404;
    }
    .badge-pending {
      background-color: #e2e3e5;
      color: #383d41;
    }
    .badge-freeze {
      background-color: #cce5ff;
      color: #004085;
    }
    .badge-balance {
      background-color: #d4edda;
      color: #155724;
    }
    .badge-auto {
      background-color: #f8d7da;
      color: #721c24;
    }
    .badge-default {
      background-color: #e9ecef;
      color: #495057;
    }
  `]
})
export class StatusBadgeComponent {
  @Input() status: string = '';

  getDisplayStatus(): string {
    switch (this.status) {
      case 'AccountValidated': return 'Awaiting Action';
      case 'Pending': return 'Pending Batch';
      case 'FreezeApplied': return 'Freeze Applied';
      case 'BalanceProvided': return 'Balance Provided';
      case 'AccountNotFound': return 'Auto Resolved';
      default: return this.status || 'Unknown';
    }
  }

  getBadgeClass(): string {
    switch (this.status) {
      case 'AccountValidated': return 'badge-awaiting';
      case 'Pending': return 'badge-pending';
      case 'FreezeApplied': return 'badge-freeze';
      case 'BalanceProvided': return 'badge-balance';
      case 'AccountNotFound': return 'badge-auto';
      default: return 'badge-default';
    }
  }
}