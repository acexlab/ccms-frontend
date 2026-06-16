import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DashboardStore } from './dashboard.store';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

class MockDashboardStore {
  data = signal<any>({
    casesProcessed: 12482,
    accountsMatched: 11904,
    accountsNotFound: 578,
    duration: '02h 14m',
    matchRate: 95.3,
    avgDuration: '02h 05m'
  });
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  isBatchRunning = signal<boolean>(false);

  loadDashboard = jasmine.createSpy('loadDashboard');
  triggerBatch = jasmine.createSpy('triggerBatch');
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockStore: MockDashboardStore;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockStore = new MockDashboardStore();
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: DashboardStore, useValue: mockStore },
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

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadDashboard on store during initialization', () => {
    expect(mockStore.loadDashboard).toHaveBeenCalled();
  });

  it('should trigger batch manual execution on click', () => {
    component.runManualBatch();
    expect(mockStore.triggerBatch).toHaveBeenCalled();
  });

  it('should display loading spinner when store is loading', () => {
    mockStore.isLoading.set(true);
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should handle user logout and redirect to login screen', () => {
    component.onLogout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
