/*
 * File: batch-processing.store.ts
 * Description: Reactive state store managing Batch Processing data, filtering, and execution.
 */

import { Injectable, signal, computed, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BatchProcessingService } from './batch-processing.service';
import { BatchStatisticsDto, BatchExecutionHistoryDto } from './batch-processing.model';

export interface BatchProcessingState {
  statistics: BatchStatisticsDto | null;
  history: BatchExecutionHistoryDto[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  runningBatch: boolean;
  page: number;
  pageSize: number;
  statusFilter: string;
}

@Injectable({
  providedIn: 'root'
})
export class BatchProcessingStore {
  private service = inject(BatchProcessingService);
  private snackBar = inject(MatSnackBar);

  // Initial State
  private state = signal<BatchProcessingState>({
    statistics: null,
    history: [],
    totalCount: 0,
    loading: false,
    error: null,
    runningBatch: false,
    page: 1,
    pageSize: 10,
    statusFilter: 'All'
  });

  // Selectors
  readonly statistics = computed(() => this.state().statistics);
  readonly history = computed(() => this.state().history);
  readonly totalCount = computed(() => this.state().totalCount);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly runningBatch = computed(() => this.state().runningBatch);
  readonly page = computed(() => this.state().page);
  readonly pageSize = computed(() => this.state().pageSize);
  readonly statusFilter = computed(() => this.state().statusFilter);

  // Actions
  loadStatistics() {
    this.service.getStatistics().subscribe({
      next: (stats) => {
        this.state.update(s => ({ ...s, statistics: stats }));
      },
      error: (err) => {
        console.error('Failed to load batch statistics:', err);
      }
    });
  }

  loadHistory() {
    this.state.update(s => ({ ...s, loading: true, error: null }));
    const { page, pageSize, statusFilter } = this.state();

    this.service.getHistory(page, pageSize, statusFilter).subscribe({
      next: (res) => {
        this.state.update(s => ({
          ...s,
          history: res.items,
          totalCount: res.totalCount,
          loading: false
        }));
      },
      error: (err) => {
        this.state.update(s => ({
          ...s,
          error: err.message || 'Failed to load batch execution history.',
          loading: false
        }));
        this.snackBar.open('Failed to load execution history.', 'Close', { duration: 3000 });
      }
    });
  }

  runBatch() {
    this.state.update(s => ({ ...s, runningBatch: true }));

    this.service.runBatch().subscribe({
      next: (res) => {
        this.snackBar.open(res.message || 'Batch Job Started Successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        
        this.state.update(s => ({ ...s, runningBatch: false }));
        // Refresh statistics and history list
        this.loadStatistics();
        this.loadHistory();
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to trigger batch job execution.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.state.update(s => ({ ...s, runningBatch: false }));
      }
    });
  }

  setPage(page: number) {
    this.state.update(s => ({ ...s, page }));
    this.loadHistory();
  }

  setStatusFilter(statusFilter: string) {
    this.state.update(s => ({ ...s, statusFilter, page: 1 }));
    this.loadHistory();
  }

  // Initializer
  init() {
    this.loadStatistics();
    this.loadHistory();
  }
}
