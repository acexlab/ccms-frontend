/*
 * File: user.model.ts
 * Description: TypeScript interfaces defining User data models and JWT token payloads.
 * To Implement: Keep user roles synced with backend claims.
 */

export type UserRole = 'CourtOfficer' | 'BankOfficer';

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export interface DecodedToken {
  sub: string;
  unique_name?: string;
  role: UserRole;
  bankCode?: string;
  exp: number;
}

export interface AuthResult {
  token: string;
  role: UserRole;
}
