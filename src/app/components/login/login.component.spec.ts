import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
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

  it('should authenticate and redirect to dashboard based on response redirectUrl', () => {
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
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/court/dashboard']);
  });

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
