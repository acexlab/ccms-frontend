/*
 * File: document.model.ts
 * Description: TypeScript interfaces defining Case Documents.
 * To Implement: Keep in sync with backend DocumentType enum.
 */

export type DocumentType = 'CourtOrder' | 'AadhaarCopy' | 'PanCopy';

export interface CaseDocument {
  id: number;
  documentType: DocumentType;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}
