/*
 * File: auth.service.ts
 * Description: Injectable service handling user login, logout, and token authorization states.
 * To Implement: Keep storage state in sync with token changes.
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';
import { AuthResult, User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromToken());
  public currentUser$ = this.currentUserSubject.asObservable();

  login(username: string, password: string): Observable<AuthResult> {
    return this.http.post<AuthResult>(`${environment.apiUrl}/auth/login`, { username, password }).pipe(
      tap(result => {
        this.tokenService.setToken(result.token);
        this.currentUserSubject.next(this.getUserFromToken());
      })
    );
  }

  logout(): void {
    this.tokenService.removeToken();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private getUserFromToken(): User | null {
    const decoded = this.tokenService.getDecodedToken();
    if (!decoded || this.tokenService.isTokenExpired()) {
      return null;
    }
    return {
      id: parseInt(decoded.sub, 10),
      username: decoded.unique_name || '',
      role: decoded.role
    };
  }
}
