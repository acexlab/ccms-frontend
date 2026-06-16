import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankCaseDetailComponent } from './bank-case-detail.component';
import { Router, ActivatedRoute } from '@angular/router';
import { CaseService } from '../../services/case.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

describe('BankCaseDetailComponent', () => {
  let component: BankCaseDetailComponent;
  let fixture: ComponentFixture<BankCaseDetailComponent>;
  let caseServiceSpy: jasmine.SpyObj<CaseService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockCaseDetails = {
    caseNumber: 'CCMS-TEST-0005',
    orderType: 'FreezeAccount',
    status: 'AccountValidated',
    complainantName: 'Income Tax Dept',
    complainantIdentityNumber: 'ABCDE1234F',
    defendantName: 'Rajesh Kumar',
    defendantAadhaar: 'XXXX XXXX 9012',
    defendantPan: 'XXXXXXXXX234F',
    defendantAccountNumber: 'XXXXXXXXXXXX3333',
    matchedAccountNumber: '111122223333',
    accountStatus: 'Active',
    currentBalance: 150000,
    documents: [
      { id: 1, documentType: 'CourtOrder', fileName: 'order.pdf', fileSize: 1024 }
    ]
  };

  beforeEach(async () => {
    caseServiceSpy = jasmine.createSpyObj('CaseService', ['getCaseDetails', 'downloadDocument']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    caseServiceSpy.getCaseDetails.and.returnValue(of(mockCaseDetails));

    await TestBed.configureTestingModule({
      imports: [BankCaseDetailComponent, FormsModule, MatIconModule],
      providers: [
        { provide: CaseService, useValue: caseServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => key === 'caseNumber' ? 'CCMS-TEST-0005' : null
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BankCaseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display case details on init', () => {
    expect(caseServiceSpy.getCaseDetails).toHaveBeenCalledWith('CCMS-TEST-0005');
    expect(component.caseDetails).toEqual(mockCaseDetails);

    // Verify masked data is shown
    expect(component.isAwaitingAction).toBeTrue();
    expect(component.isResponded).toBeFalse();
  });

  it('should redirect to freeze-response if orderType is FreezeAccount', () => {
    component.navigateToResponse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/bank/cases', 'CCMS-TEST-0005', 'freeze-response']);
  });

  it('should redirect to balance-response if orderType is BalanceEnquiry', () => {
    component.caseDetails.orderType = 'BalanceEnquiry';
    component.navigateToResponse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/bank/cases', 'CCMS-TEST-0005', 'balance-response']);
  });

  it('should call downloadDocument on CaseService', () => {
    const mockBlob = new Blob(['mock-pdf-content'], { type: 'application/pdf' });
    caseServiceSpy.downloadDocument.and.returnValue(of(mockBlob));
    
    spyOn(window.URL, 'createObjectURL').and.returnValue('mock-url');
    spyOn(window.URL, 'revokeObjectURL');

    component.downloadDocument(1);

    expect(caseServiceSpy.downloadDocument).toHaveBeenCalledWith('CCMS-TEST-0005', 1);
  });
});
