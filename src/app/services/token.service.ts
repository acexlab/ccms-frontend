import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'ccms_token';

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  }

  getRole(): UserRole | null {
    const decoded = this.getDecodedToken();
    return decoded ? decoded.role : null;
  }

  isTokenExpired(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded) return true;
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  }
}