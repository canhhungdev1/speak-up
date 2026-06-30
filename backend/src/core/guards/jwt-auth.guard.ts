import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Thêm logic tùy chỉnh ở đây nếu cần (VD: Ghi log)
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // Nếu có lỗi hoặc không tìm thấy user từ JwtStrategy -> Bắn lỗi 401
    if (err || !user) {
      throw err || new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
    return user;
  }
}
