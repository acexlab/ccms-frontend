/*
 * File: case.service.ts
 * Description: Injectable service wrapping court officer case listing, details, and creation API endpoints.
 * To Implement: Handle file upload progress indicators in UI components if needed.
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CaseDetail, CaseSummary } from '../models/case.model';

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private http = inject(HttpClient);

  createCase(formData: FormData): Observable<{ caseNumber: string; id: number }> {
    return this.http.post<{ caseNumber: string; id: number }>(`${environment.apiUrl}/cases`, formData);
  }

  getMyCases(): Observable<CaseSummary[]> {
    return this.http.get<CaseSummary[]>(`${environment.apiUrl}/cases`);
  }

  getCaseById(id: number): Observable<CaseDetail> {
    return this.http.get<CaseDetail>(`${environment.apiUrl}/cases/${id}`);
  }
}
