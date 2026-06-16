import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatProgressBarModule],
  template: `
    <mat-progress-bar 
      *ngIf="loadingService.isLoading()" 
      mode="indeterminate" 
      color="primary"
      class="fixed top-0 left-0 right-0 z-[9999] !h-1.5">
    </mat-progress-bar>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  readonly loadingService = inject(LoadingService);
  title = 'ccms-frontend';
}