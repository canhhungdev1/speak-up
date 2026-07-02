import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Chuyển việc đợi thành Observable, bảo toàn Angular Zone
  return from(authService.waitForAuthReady()).pipe(
    map(() => {
      const role = authService.userProfile()?.role;
      
      if (role === 'ADMIN') {
        return true;
      }
      
      // Nếu không phải admin, đẩy về trang dashboard của student
      return router.parseUrl('/student/dashboard');
    })
  );
};
