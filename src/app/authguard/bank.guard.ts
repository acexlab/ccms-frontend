import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const bankGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.getToken() && !tokenService.isTokenExpired()) {
    const role = tokenService.getRole();
    if (role === 'Bank') {
      return true;
    }
    if (role === 'Court') {
      router.navigate(['/court/dashboard']);
      return false;
    }
  }

  router.navigate(['/login']);
  return false;
};