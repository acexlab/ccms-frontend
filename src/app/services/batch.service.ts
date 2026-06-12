/*
 * File: batch.service.ts
 * Description: Injectable service wrapping manual batch execution triggers and run history logs.
 * To Implement: Keep in sync with backend BatchController schema.
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BatchJobLog {
  runAt: string;
  casesProcessed: number;
  casesValidated: number;
  casesNotFound: number;
  durationMs: number;
}

@Injectable({
  providedIn: 'root'
})
export class BatchService {
  private http = inject(HttpClient);

  triggerManualRun(): Observable<BatchJobLog> {
    return this.http.post<BatchJobLog>(`${environment.apiUrl}/batch/run`, {});
  }

  getLastRun(): Observable<BatchJobLog> {
    return this.http.get<BatchJobLog>(`${environment.apiUrl}/batch/last-run`);
  }
}
