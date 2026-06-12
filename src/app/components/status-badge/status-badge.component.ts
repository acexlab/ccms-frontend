/*
 * File: status-badge.component.ts
 * Description: Standalone status chip displaying color indicators for Case status values.
 * To Implement: Keep CSS rules consistent.
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { CaseStatus } from '../../models/case.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  template: `
    <span class="badge" [ngClass]="getBadgeClass(status)">
      {{ status }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-block;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 500;
      border-radius: 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-grey {
      background-color: #e0e0e0;
      color: #616161;
    }
    .badge-blue {
      background-color: #e3f2fd;
      color: #1565c0;
    }
    .badge-red {
      background-color: #ffebee;
      color: #c62828;
    }
    .badge-green {
      background-color: #e8f5e9;
      color: #2e7d32;
    }
  `]
})
export class StatusBadgeComponent {
  @Input() status: CaseStatus = 'Pending';

  getBadgeClass(status: CaseStatus): string {
    switch (status) {
      case 'Pending':
        return 'badge-grey';
      case 'AccountValidated':
        return 'badge-blue';
      case 'AccountNotFound':
        return 'badge-red';
      case 'FreezeApplied':
      case 'BalanceProvided':
        return 'badge-green';
      default:
        return 'badge-grey';
    }
  }
}
