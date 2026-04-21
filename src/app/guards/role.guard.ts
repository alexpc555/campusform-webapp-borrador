import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.services';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.getCurrentUser();

  const expectedRole = route.data['role'];
  const expectedRoles = route.data['roles'] as string[] | undefined;

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  if (expectedRoles && expectedRoles.includes(user.role)) {
    return true;
  }

  if (expectedRole && user.role === expectedRole) {
    return true;
  }

  if (user.role === 'admin') {
    router.navigate(['/admin']);
    return false;
  }

  if (user.role === 'teacher') {
    router.navigate(['/profesor']);
    return false;
  }

  if (user.role === 'student') {
    router.navigate(['/student-panel']);
    return false;
  }

  router.navigate(['/login']);
  return false;
};