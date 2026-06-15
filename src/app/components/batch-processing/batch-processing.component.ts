/*
 * File: batch-processing.component.ts
 * Description: Controller for Batch Processing page view, binding Signal selectors to the template.
 */

import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { BatchProcessingStore } from './batch-processing.store';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-batch-processing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatMenuModule
  ],
  templateUrl: './batch-processing.component.html',
  styleUrls: ['./batch-processing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BatchProcessingComponent implements OnInit {
  readonly store = inject(BatchProcessingStore);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.store.init();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  runManualBatch() {
    this.store.runBatch();
  }

  onFilterStatus(status: string) {
    this.store.setStatusFilter(status);
  }

  onSelectPage(page: number) {
    const totalPages = this.totalPages();
    if (page >= 1 && page <= totalPages) {
      this.store.setPage(page);
    }
  }

  // Helper computation methods for pagination
  totalPages(): number {
    const total = this.store.totalCount();
    const size = this.store.pageSize();
    return Math.ceil(total / size) || 1;
  }

  getPagesArray(): number[] {
    const total = this.totalPages();
    const current = this.store.page();
    
    // Always show at least page 1
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Dynamic pagination slice (e.g. show current page ± 2)
    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    if (start === 1) {
      end = 5;
    } else if (end === total) {
      start = total - 4;
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Get index range display: e.g. "1-10"
  getRangeText(): string {
    const page = this.store.page();
    const size = this.store.pageSize();
    const total = this.store.totalCount();
    
    if (total === 0) return '0-0';
    
    const start = (page - 1) * size + 1;
    const end = Math.min(page * size, total);
    return `${start}-${end}`;
  }

  // trackBy helper for *ngFor execution logs
  trackByRunId(index: number, item: any): string {
    return item.runId;
  }
}
