import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-md border" [ngClass]="containerClass">
      <mat-icon class="text-xl flex-shrink-0">{{ data.icon }}</mat-icon>
      <div class="flex-1 text-sm font-semibold leading-tight whitespace-pre-line">
        {{ data.message }}
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ToastComponent {
  readonly data = inject(MAT_SNACK_BAR_DATA);

  get containerClass(): string {
    switch (this.data.type) {
      case 'success':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'error':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'info':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  }
}
