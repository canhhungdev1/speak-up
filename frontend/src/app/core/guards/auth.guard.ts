import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Chuyển Promise thành Observable bằng lệnh from()
  return from(authService.getSession()).pipe(
    map(({ data: { session } }) => {
      // Vì đang dùng Observable (RxJS), quá trình xử lý này vẫn chạy bên trong Angular Zone an toàn
      if (session) {
        return true;
      }
      return router.parseUrl('/auth');
    })
  );
};
