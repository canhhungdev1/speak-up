import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');
  
  if (token) {
    return true; // Cho phép truy cập
  }
  
  // Chưa đăng nhập thì đá về trang login
  router.navigate(['/auth']);
  return false;
};
