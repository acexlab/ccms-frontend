import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 my-4">
      <mat-icon class="!text-5xl !text-slate-350 !mb-4 !h-12 !w-12 flex items-center justify-center">{{ icon }}</mat-icon>
      <h3 class="font-bold text-slate-800 text-lg mb-1 leading-snug">{{ title }}</h3>
      <p class="text-slate-500 text-sm max-w-sm mb-6">{{ description }}</p>
      <button *ngIf="actionText" 
              mat-flat-button 
              color="primary" 
              (click)="actionClicked.emit()" 
              class="!rounded-lg !bg-primary !text-white font-semibold shadow-sm hover:shadow-md transition-all">
        {{ actionText }}
      </button>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() icon: string = 'folder_open';
  @Input() title: string = 'No cases found';
  @Input() description: string = 'There are no items currently available in this section.';
  @Input() actionText: string = '';

  @Output() actionClicked = new EventEmitter<void>();
}
