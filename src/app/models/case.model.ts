/*
 * File: case.model.ts
 * Description: TypeScript interfaces defining Case records and status types.
 * To Implement: Keep in sync with backend Case entity structure.
 */

import { CaseDocument } from './document.model';
import { CaseResponse } from './case-response.model';

export type CaseStatus = 'Pending' | 'AccountValidated' | 'AccountNotFound' | 'FreezeApplied' | 'BalanceProvided';
export type OrderType = 'FreezeAccount' | 'BalanceEnquiry';

export interface CaseSummary {
  id: number;
  caseNumber: string;
  orderType: OrderType;
  status: CaseStatus;
  createdAt: string;
  defendantName: string;
}

export interface CaseDetail extends CaseSummary {
  complainantName: string;
  defendantAadhaar: string;
  defendantPan: string;
  defendantAccountNumber: string;
  bankCode: string;
  freezeAmount?: number;
  documents: CaseDocument[];
  response?: CaseResponse;
  matchedAccountNumber?: string;
  matchedBalance?: number;
}
