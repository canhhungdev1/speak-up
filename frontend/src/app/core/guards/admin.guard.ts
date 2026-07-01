import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  await authService.waitForAuthReady();

  const role = authService.userProfile()?.role;
  
  if (role === 'ADMIN') {
    return true;
  }
  
  // Nếu không phải admin, đẩy về trang dashboard của student
  router.navigate(['/student/dashboard']);
  return false;
};
