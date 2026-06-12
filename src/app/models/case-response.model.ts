/*
 * File: case-response.model.ts
 * Description: TypeScript interfaces defining bank responses to court orders.
 * To Implement: Keep properties mapped to CaseResponseDto parameters.
 */

export interface CaseResponse {
  id: number;
  responseType: 'FreezeApplied' | 'BalanceProvided' | 'AccountNotFound';
  reportedAmount?: number;
  remarks: string;
  respondedAt: string;
  isSystemGenerated: boolean;
}
