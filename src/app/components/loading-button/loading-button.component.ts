import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-loading-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule],
  template: `
    <button [type]="type"
            [disabled]="disabled || loading"
            (click)="onButtonClick($event)"
            class="loading-btn flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all duration-200"
            [ngClass]="customClass + ' ' + (color === 'primary' ? 'bg-primary text-white hover:bg-primary-hover' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')"
            [style.cursor]="(disabled || loading) ? 'not-allowed' : 'pointer'"
            [style.opacity]="(disabled || loading) ? '0.6' : '1'">
      <mat-spinner *ngIf="loading" diameter="18" class="text-current"></mat-spinner>
      <mat-icon *ngIf="!loading && icon" class="text-base flex items-center justify-center">{{ icon }}</mat-icon>
      <span>{{ loading ? loadingText : text }}</span>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    .loading-btn:disabled {
      cursor: not-allowed !important;
    }
  `]
})
export class LoadingButtonComponent {
  @Input() type: string = 'button';
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() color: string = 'primary';
  @Input() icon: string = '';
  @Input() text: string = '';
  @Input() loadingText: string = 'Loading...';
  @Input() customClass: string = '';

  @Output() onClick = new EventEmitter<MouseEvent>();

  onButtonClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.onClick.emit(event);
    }
  }
}
