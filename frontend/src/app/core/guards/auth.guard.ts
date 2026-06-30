import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Nếu đã đăng nhập, cho phép truy cập
  if (authService.currentUser()) {
    return true;
  }

  // Nếu chưa đăng nhập, chuyển hướng về trang auth
  return router.parseUrl('/auth');
};
