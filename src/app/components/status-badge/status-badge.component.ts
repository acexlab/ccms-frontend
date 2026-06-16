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
      background-color: #e0f2fe;
      color: #0369a1;
      border: 1px solid #bae6fd;
    }
    .badge-pending {
      background-color: #fef3c7;
      color: #d97706;
      border: 1px solid #fde68a;
    }
    .badge-freeze {
      background-color: #fee2e2;
      color: #dc2626;
      border: 1px solid #fca5a5;
    }
    .badge-balance {
      background-color: #dcfce7;
      color: #15803d;
      border: 1px solid #bbf7d0;
    }
    .badge-auto {
      background-color: #f3f4f6;
      color: #4b5563;
      border: 1px solid #e5e7eb;
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