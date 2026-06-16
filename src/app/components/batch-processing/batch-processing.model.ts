/*
 * File: batch-processing.model.ts
 * Description: Strongly-typed models for Batch Processing statistics and run history.
 */

export interface BatchStatisticsDto {
  casesProcessed: number;
  accountsMatched: number;
  accountsNotFound: number;
  duration: string;
  matchRate: number;
  notFoundRate: number;
  changeRate: number;
  avgDuration: string;
}

export interface BatchExecutionHistoryDto {
  runId: string;
  startTime: string;
  endTime: string | null;
  duration: string;
  status: string;
}

export interface BatchHistoryResponseDto {
  items: BatchExecutionHistoryDto[];
  totalCount: number;
}

export interface BatchRunResponse {
  success: boolean;
  message: string;
}
