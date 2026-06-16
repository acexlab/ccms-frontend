import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from '../components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.snackBar.openFromComponent(ToastComponent, {
      data: { message, type: 'success', icon: 'check_circle' },
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['toast-success-container']
    });
  }

  error(message: string): void {
    this.snackBar.openFromComponent(ToastComponent, {
      data: { message, type: 'error', icon: 'cancel' },
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['toast-error-container']
    });
  }

  warning(message: string): void {
    this.snackBar.openFromComponent(ToastComponent, {
      data: { message, type: 'warning', icon: 'warning' },
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['toast-warning-container']
    });
  }

  info(message: string): void {
    this.snackBar.openFromComponent(ToastComponent, {
      data: { message, type: 'info', icon: 'info' },
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['toast-info-container']
    });
  }
}
