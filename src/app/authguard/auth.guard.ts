/*
 * File: auth.guard.ts
 * Description: Guard checking for valid authentication token before accessing secured routes.
 * To Implement: Redirects unauthenticated users to login page.
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.getToken() && !tokenService.isTokenExpired()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
