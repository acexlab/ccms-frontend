import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreateCaseComponent } from './create-case.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CaseService } from '../../services/case.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { of, throwError } from 'rxjs';

describe('CreateCaseComponent', () => {
  let component: CreateCaseComponent;
  let fixture: ComponentFixture<CreateCaseComponent>;
  let caseServiceSpy: jasmine.SpyObj<CaseService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    caseServiceSpy = jasmine.createSpyObj('CaseService', ['getMyCases', 'createCase']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error', 'warning']);

    caseServiceSpy.getMyCases.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [CreateCaseComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: CaseService, useValue: caseServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => null } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize at Step 1 with invalid form', () => {
    expect(component.currentStep).toBe(1);
    expect(component.createCaseForm.valid).toBeFalse();
  });

  it('should validate Step 1 fields before navigating to Step 2', () => {
    // Attempt navigation forward without filling fields
    component.changeStep(1);
    expect(component.currentStep).toBe(1); // Locked at Step 1

    // Fill valid Step 1 fields
    component.createCaseForm.patchValue({
      complainantName: 'Income Tax Dept',
      complainantId: 'ABCDE1234F',
      defendantName: 'Rajesh Kumar',
      defendantId: '123456789012',
      defendantAccountNumber: '111122223333',
      defendantBankName: 'SBI'
    });

    component.changeStep(1);
    expect(component.currentStep).toBe(2); // Navigated to Step 2
  });

  it('should handle order type toggling and update validators', () => {
    // Default is 'freeze'
    expect(component.orderType).toBe('freeze');
    const freezeAmountControl = component.createCaseForm.get('freezeAmount');

    // Switch to enquiry
    component.setOrderType('enquiry');
    expect(component.orderType).toBe('enquiry');
    expect(freezeAmountControl?.validator).toBeNull();

    // Switch back to freeze
    component.setOrderType('freeze');
    expect(component.orderType).toBe('freeze');
    expect(freezeAmountControl?.validator).not.toBeNull();
  });

  it('should reject files exceeding 5MB', () => {
    const hugeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'huge.pdf', { type: 'application/pdf' });
    const event = { target: { files: [hugeFile] } };

    component.onFileSelected(event, 'courtOrder');
    expect(notificationServiceSpy.error).toHaveBeenCalledWith('File huge.pdf exceeds the 5MB limit.');
    expect(component.courtOrderFile).toBeNull();
  });

  it('should accept valid files and allow removal', () => {
    const validFile = new File([new ArrayBuffer(100 * 1024)], 'order.pdf', { type: 'application/pdf' });
    const event = { target: { files: [validFile] } };

    component.onFileSelected(event, 'courtOrder');
    expect(component.courtOrderFile).toBe(validFile);

    component.removeFile('courtOrder');
    expect(component.courtOrderFile).toBeNull();
  });

  it('should submit case and redirect on success', fakeAsync(() => {
    component.createCaseForm.patchValue({
      complainantName: 'Income Tax Dept',
      complainantId: 'ABCDE1234F',
      defendantName: 'Rajesh Kumar',
      defendantId: '123456789012',
      defendantAccountNumber: '111122223333',
      defendantBankName: 'SBI',
      orderType: 'freeze',
      freezeAmount: 5000,
      declaration: true
    });

    component.courtOrderFile = new File([new ArrayBuffer(100)], 'order.pdf');
    component.aadhaarFile = new File([new ArrayBuffer(100)], 'aadhaar.jpg');
    component.panFile = new File([new ArrayBuffer(100)], 'pan.png');

    caseServiceSpy.createCase.and.returnValue(of({ caseNumber: 'CCMS-20260616-0001', id: 1 }));

    component.submitCase();

    expect(component.isSubmitting).toBeTrue();
    expect(component.submitSuccess).toBeTrue();
    expect(component.referenceId).toBe('CCMS-20260616-0001');
    
    tick(400); // fast forward timeout
    
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/court/dashboard']);
  }));
});
