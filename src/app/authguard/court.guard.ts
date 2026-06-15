import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const courtGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.getToken() && !tokenService.isTokenExpired()) {
    const role = tokenService.getRole();
    if (role === 'Court') {
      return true;
    }
    if (role === 'Bank') {
      router.navigate(['/bank/dashboard']);
      return false;
    }
  }

  router.navigate(['/login']);
  return false;
};