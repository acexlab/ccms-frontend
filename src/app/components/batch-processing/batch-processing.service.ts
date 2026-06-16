/*
 * File: batch-processing.service.ts
 * Description: HTTP service layer for communicating with backend Batch API endpoints.
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BatchStatisticsDto, BatchHistoryResponseDto, BatchRunResponse } from './batch-processing.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BatchProcessingService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getStatistics(): Observable<BatchStatisticsDto> {
    return this.http.get<BatchStatisticsDto>(`${this.baseUrl}/batch/statistics`);
  }

  getHistory(page: number, pageSize: number, status: string): Observable<BatchHistoryResponseDto> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (status && status !== 'All') {
      params = params.set('status', status);
    }

    return this.http.get<BatchHistoryResponseDto>(`${this.baseUrl}/batch/history`, { params });
  }

  runBatch(): Observable<BatchRunResponse> {
    return this.http.post<BatchRunResponse>(`${this.baseUrl}/batch/run`, {});
  }
}
