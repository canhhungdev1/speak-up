import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { parseJwt } from '../shared/utils/jwt.util';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');
  
  if (token) {
    try {
      const payload = parseJwt(token);
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
