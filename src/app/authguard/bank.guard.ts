/*
 * File: bank.guard.ts
 * Description: Guard checking that the logged-in user role is BankOfficer.
 * To Implement: Handle redirect routes securely.
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const bankGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.getToken() && !tokenService.isTokenExpired()) {
    const role = tokenService.getRole();
    if (role === 'BankOfficer') {
      return true;
    }
    // If court officer is logged in, redirect them to court dashboard
    if (role === 'CourtOfficer') {
      router.navigate(['/court/dashboard']);
      return false;
    }
  }

  router.navigate(['/login']);
  return false;
};
