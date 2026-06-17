import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { LoadingButtonComponent } from '../loading-button/loading-button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingButtonComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  isSubmitting = false;
  errorMessage: string | null = null;
  showPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const credentials = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };
    this.authService.login(credentials).subscribe({
      next: (result) => {
        this.notificationService.success('Login successful');
        setTimeout(() => {
          this.isSubmitting = false;
          if (result.redirectUrl) {
            this.router.navigate([result.redirectUrl]);
          } else {
            // Fallback
            const route = result.role === 'Court' ? '/court/dashboard' : '/bank/dashboard';
            this.router.navigate([route]);
          }
        }, 400);
      },
      error: (err) => {
        this.isSubmitting = false;
        const msg = err.error?.message || 'Invalid username or password.';
        this.errorMessage = msg;
        this.notificationService.error(msg);
      }
    });
  }
}