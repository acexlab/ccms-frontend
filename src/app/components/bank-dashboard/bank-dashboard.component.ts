/*
 * File: bank-dashboard.component.ts
 * Description: Controller for the Bank Officer dashboard page.
 * To Implement: Handle batch refresh timer state.
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CaseInboxService } from '../../services/case-inbox.service';
import { BatchService, BatchJobLog } from '../../services/batch.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-bank-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    NavbarComponent
  ],
  templateUrl: './bank-dashboard.component.html',
  styleUrls: ['./bank-dashboard.component.scss']
})
export class BankDashboardComponent implements OnInit {
  private inboxService = inject(CaseInboxService);
  private batchService = inject(BatchService);
  private snackBar = inject(MatSnackBar);

  awaitingActionCount = 0;
  completedCount = 0;
  autoResolvedCount = 0;
  pendingBatchCount = 0;

  lastRun: BatchJobLog | null = null;
  isTriggering = false;

  ngOnInit(): void {
    this.loadStats();
    this.loadBatchLog();
  }

  loadStats(): void {
    this.inboxService.getCasesForBank().subscribe({
      next: (cases) => {
        this.awaitingActionCount = cases.filter(c => c.status === 'AccountValidated').length;
        this.completedCount = cases.filter(c => c.status === 'FreezeApplied' || c.status === 'BalanceProvided').length;
        this.autoResolvedCount = cases.filter(c => c.status === 'AccountNotFound').length;
        this.pendingBatchCount = cases.filter(c => c.status === 'Pending').length;
      }
    });
  }

  loadBatchLog(): void {
    this.batchService.getLastRun().subscribe({
      next: (log) => {
        this.lastRun = log;
      },
      error: () => {
        this.lastRun = null;
      }
    });
  }

  triggerBatchNow(): void {
    this.isTriggering = true;
    this.batchService.triggerManualRun().subscribe({
      next: (log) => {
        this.isTriggering = false;
        this.snackBar.open('Batch job ran successfully!', 'Close', { duration: 5000 });
        this.loadStats();
        this.loadBatchLog();
      },
      error: (err) => {
        this.isTriggering = false;
        this.snackBar.open(err.error?.Message || 'Failed to trigger batch validation.', 'Close', { duration: 5000 });
      }
    });
  }
}
