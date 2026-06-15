/*
 * File: case.service.ts
 * Description: Injectable service wrapping court officer case listing, details, and creation API endpoints.
 * To Implement: Handle file upload progress indicators in UI components if needed.
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
}