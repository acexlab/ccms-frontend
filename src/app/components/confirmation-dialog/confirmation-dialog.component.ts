import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="p-6">
      <h2 mat-dialog-title class="!text-lg !font-bold !text-slate-900 !m-0 !mb-2">{{ data.title }}</h2>
      <mat-dialog-content class="!text-sm !text-slate-600 !mb-6 !p-0">
        {{ data.message }}
      </mat-dialog-content>
      <mat-dialog-actions class="!flex !justify-end !gap-3 !p-0">
        <button mat-button (click)="dialogRef.close(false)" class="!rounded-lg !px-4 !py-2 !text-slate-500 font-semibold hover:bg-slate-50 transition-colors">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button mat-flat-button [color]="data.confirmColor || 'primary'" (click)="dialogRef.close(true)" class="!rounded-lg !px-5 !py-2 !font-semibold !bg-primary !text-white transition-all">
          {{ data.confirmText || 'Confirm' }}
        </button>
      </mat-dialog-actions>
    </div>
  `
})
export class ConfirmationDialogComponent {
  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
}
