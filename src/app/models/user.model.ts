export type UserRole = 'Court' | 'Bank';

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export interface DecodedToken {
  unique_name?: string;
  role: UserRole;
  exp: number;
}

export interface AuthResult {
  token: string;
  role: UserRole;
  redirectUrl: string;
}