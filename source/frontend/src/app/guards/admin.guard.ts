import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');
  
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'ADMIN') {
        return true; // Cho phép truy cập
      }
    } catch (e) {
      console.error('Invalid token payload', e);
    }
  }
  
  // Không phải admin thì đá về trang dashboard của học viên
  router.navigate(['/dashboard']);
  return false;
};
