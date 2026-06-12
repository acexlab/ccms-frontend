/*
 * File: court.guard.ts
 * Description: Guard checking that the logged-in user role is CourtOfficer.
 * To Implement: Handle redirect routes securely.
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const courtGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.getToken() && !tokenService.isTokenExpired()) {
    const role = tokenService.getRole();
    if (role === 'CourtOfficer') {
      return true;
    }
    // If bank officer is logged in, redirect them to bank dashboard
    if (role === 'BankOfficer') {
      router.navigate(['/bank/dashboard']);
      return false;
    }
  }

  router.navigate(['/login']);
  return false;
};
