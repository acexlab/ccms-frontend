import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error', 'warning']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form on initialization', () => {
    expect(component.loginForm.valid).toBeFalse();
    expect(component.loginForm.get('username')?.valid).toBeFalse();
    expect(component.loginForm.get('password')?.valid).toBeFalse();
  });

  it('should mark fields as touched and not submit when form is invalid', () => {
    component.onSubmit();
    expect(component.loginForm.get('username')?.touched).toBeTrue();
    expect(component.loginForm.get('password')?.touched).toBeTrue();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalse();
  });

  it('should authenticate and redirect to dashboard based on response redirectUrl', fakeAsync(() => {
    component.loginForm.patchValue({
      username: 'court.user',
      password: 'Password@123'
    });

    const authResult = { token: 'mock-jwt', role: 'Court' as const, redirectUrl: '/court/dashboard' };
    authServiceSpy.login.and.returnValue(of(authResult));

    component.onSubmit();

    expect(component.isSubmitting).toBeTrue();
    expect(authServiceSpy.login).toHaveBeenCalledWith({
      username: 'court.user',
      password: 'Password@123'
    });
    
    tick(400); // Fast-forward time to resolve setTimeout
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/court/dashboard']);
  }));

  it('should display error message on authentication failure', () => {
    component.loginForm.patchValue({
      username: 'wrong.user',
      password: 'wrong.password'
    });

    const errorResponse = { error: { message: 'Invalid username or password.' } };
    authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

    component.onSubmit();

    expect(component.isSubmitting).toBeFalse();
    expect(component.errorMessage).toBe('Invalid username or password.');
  });
});
