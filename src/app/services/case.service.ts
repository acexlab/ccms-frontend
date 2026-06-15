import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private apiUrl = '/api/cases'; // Assuming proxy setup or interceptor adds base URL

  constructor(private http: HttpClient) {}

  getInboxCases(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/inbox`);
  }

  getCaseDetails(caseNumber: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${caseNumber}`);
  }

  submitCaseResponse(caseNumber: string, payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${caseNumber}/response`, payload);
  }

  downloadDocument(caseNumber: string, documentId: number) {
    return this.http.get(`${this.apiUrl}/${caseNumber}/documents/${documentId}/download`, { responseType: 'blob' });
  }
}