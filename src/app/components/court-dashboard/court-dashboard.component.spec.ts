import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourtDashboardComponent } from './court-dashboard.component';
import { Router } from '@angular/router';
import { CaseService } from '../../services/case.service';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

describe('CourtDashboardComponent', () => {
  let component: CourtDashboardComponent;
  let fixture: ComponentFixture<CourtDashboardComponent>;
  let caseServiceSpy: jasmine.SpyObj<CaseService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockCases = [
    { caseNumber: 'C1', status: 'Pending', orderType: 'FreezeAccount' },
    { caseNumber: 'C2', status: 'AccountValidated', orderType: 'FreezeAccount' },
    { caseNumber: 'C3', status: 'FreezeApplied', orderType: 'FreezeAccount' },
    { caseNumber: 'C4', status: 'BalanceProvided', orderType: 'BalanceEnquiry' },
    { caseNumber: 'C5', status: 'AccountNotFound', orderType: 'BalanceEnquiry' },
    { caseNumber: 'C6', status: 'Pending', orderType: 'BalanceEnquiry' }
  ];

  beforeEach(async () => {
    caseServiceSpy = jasmine.createSpyObj('CaseService', ['getMyCases']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    caseServiceSpy.getMyCases.and.returnValue(of(mockCases));

    await TestBed.configureTestingModule({
      imports: [CourtDashboardComponent, CommonModule, FormsModule],
      providers: [
        { provide: CaseService, useValue: caseServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => null } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CourtDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load cases and set summary statistics counts', () => {
    expect(caseServiceSpy.getMyCases).toHaveBeenCalled();
    expect(component.cases.length).toBe(6);

    expect(component.countStatus('Pending')).toBe(2);
    expect(component.countStatus('AccountValidated')).toBe(1);
    expect(component.countStatus('FreezeApplied')).toBe(1);
    expect(component.countStatus('BalanceProvided')).toBe(1);
    expect(component.countStatus('AccountNotFound')).toBe(1);
  });

  it('should filter cases by search query and status dropdown', () => {
    // Search query match
    component.searchQuery = 'C1';
    expect(component.filteredCases.length).toBe(1);
    expect(component.filteredCases[0].caseNumber).toBe('C1');

    // Status filter match
    component.searchQuery = '';
    component.statusFilter = 'Pending';
    expect(component.filteredCases.length).toBe(2);

    // No search query matches
    component.searchQuery = 'Non-existent';
    expect(component.filteredCases.length).toBe(0);
  });

  it('should handle user logout and navigate to login screen', () => {
    component.onLogout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
