import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Đợi session thực tế từ Supabase để tránh lỗi race condition
  const { data: { session } } = await authService.getSession();

  // Nếu đã đăng nhập, cho phép truy cập
  if (session) {
    return true;
  }

  // Nếu chưa đăng nhập, chuyển hướng về trang auth
  return router.parseUrl('/auth');
};
