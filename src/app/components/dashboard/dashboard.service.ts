import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardDto, BatchRunResponse } from './dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5000/api';

  getDashboardData(): Observable<DashboardDto> {
    return this.http.get<DashboardDto>(`${this.baseUrl}/bank/dashboard`);
  }

  runManualBatch(): Observable<BatchRunResponse> {
    return this.http.post<BatchRunResponse>(`${this.baseUrl}/batch/run`, {});
  }
}
