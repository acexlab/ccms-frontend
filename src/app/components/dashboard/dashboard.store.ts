import { Injectable, signal, computed, inject } from '@angular/core';
import { DashboardDto } from './dashboard.model';
import { DashboardService } from './dashboard.service';
import { NotificationService } from '../../services/notification.service';

export interface DashboardState {
  data: DashboardDto | null;
  isLoading: boolean;
  error: string | null;
  isBatchRunning: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardStore {
  private service = inject(DashboardService);
  private notificationService = inject(NotificationService);

  // State
  private state = signal<DashboardState>({
    data: null,
    isLoading: true,
    error: null,
    isBatchRunning: false
  });

  // Selectors
  readonly data = computed(() => this.state().data);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly error = computed(() => this.state().error);
  readonly isBatchRunning = computed(() => this.state().isBatchRunning);

  // Actions
  loadDashboard() {
    this.state.update(s => ({ ...s, isLoading: true, error: null }));
    
    this.service.getDashboardData().subscribe({
      next: (data) => this.state.update(s => ({ ...s, data, isLoading: false })),
      error: (err) => this.state.update(s => ({ ...s, error: err.message, isLoading: false }))
    });
  }

  triggerBatch() {
    this.state.update(s => ({ ...s, isBatchRunning: true }));
    
    this.service.runManualBatch().subscribe({
      next: (res) => {
        this.notificationService.success(res.message);
        this.state.update(s => ({ ...s, isBatchRunning: false }));
        // Reload dashboard to see updated stats
        this.loadDashboard();
      },
      error: (err) => {
        this.notificationService.error(err.error?.message || 'Failed to run batch job.');
        this.state.update(s => ({ ...s, isBatchRunning: false }));
      }
    });
  }
}
