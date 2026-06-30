import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');

  // Clone request và thêm Header Authorization nếu có token
  if (token) {
    console.log('[Interceptor] Đã tìm thấy token, đang gắn vào header...');
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  } else {
    console.warn('[Interceptor] CẢNH BÁO: KHÔNG TÌM THẤY TOKEN TRONG LOCALSTORAGE!');
  }

  // Nếu chưa có token, cứ tiếp tục gửi request gốc
  return next(req);
};
