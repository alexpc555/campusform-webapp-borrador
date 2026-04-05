import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.services';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();
  const user = auth.getCurrentUser();

  if (token && user) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};