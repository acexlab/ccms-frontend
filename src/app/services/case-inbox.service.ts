/*
 * File: case-inbox.service.ts
 * Description: Injectable service wrapping bank officer inbox management and order responses.
 * To Implement: Keep in sync with backend cases controller endpoints.
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CaseDetail, CaseSummary } from '../models/case.model';

export interface SubmitResponseDto {
  reportedAmount?: number;
  remarks: string;
}

@Injectable({
  providedIn: 'root'
})
export class CaseInboxService {
  private http = inject(HttpClient);

  getCasesForBank(): Observable<CaseSummary[]> {
    return this.http.get<CaseSummary[]>(`${environment.apiUrl}/cases`);
  }

  getCaseById(id: number): Observable<CaseDetail> {
    return this.http.get<CaseDetail>(`${environment.apiUrl}/cases/${id}`);
  }

  submitResponse(caseId: number, dto: SubmitResponseDto): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/cases/${caseId}/response`, dto);
  }
}
