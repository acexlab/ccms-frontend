/*
 * File: jwt.interceptor.ts
 * Description: HTTP interceptor attaching JWT token headers to outgoing backend requests.
 * To Implement: Exclude external or authentication APIs from token injection if needed.
 */

import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../services/token.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  if (token && !tokenService.isTokenExpired()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
