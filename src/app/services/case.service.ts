/*
 * File: case.service.ts
 * Description: Injectable service wrapping case listing, details, creation, and bank responses.
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  createCase(formData: FormData): Observable<{ caseNumber: string; id: number }> {
    return this.http.post<{ caseNumber: string; id: number }>(`${this.apiUrl}/cases`, formData);
  }

  getMyCases(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cases`);
  }

  getCaseById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cases/${id}`);
  }

  getInboxCases(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cases/inbox`);
  }

  getCaseDetails(caseNumber: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cases/${caseNumber}`);
  }

  submitCaseResponse(caseNumber: string, payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cases/${caseNumber}/response`, payload);
  }

  downloadDocument(caseNumber: string, documentId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/cases/${caseNumber}/documents/${documentId}/download`, { responseType: 'blob' });
  }

  downloadAttachment(documentId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/attachments/${documentId}/download`, { responseType: 'blob' });
  }
}