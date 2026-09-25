import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard: Prevents unauthenticated users from accessing /dashboard
 */
export class AuthGuard {
  static canActivate: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
      return true;
    }

    router.navigate(['/login']);
    return false;
  };

  /**
   * Login Guard: Redirects already logged-in users away from /login to /dashboard
   */
  static canActivateLogin: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
      router.navigate(['/dashboard']);
      return false;
    }

    return true;
  };
}
