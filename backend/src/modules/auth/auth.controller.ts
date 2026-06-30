import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sync')
  @UseGuards(JwtAuthGuard)
  async syncUser(@Request() req, @Body() body: { fullName: string; avatarUrl?: string }) {
    // Nhờ có JwtAuthGuard, thông tin giải mã từ Token sẽ nằm trong req.user
    const { userId, email } = req.user;
    
    // Đảm bảo có full_name (fallback về email nếu undefined)
    const fullName = body.fullName || email.split('@')[0];

    // Gọi Service để lưu vào Local Database
    return this.authService.syncUser({
      authProviderId: userId,
      email: email,
      fullName: fullName,
      avatarUrl: body.avatarUrl || null,
    });
  }
}
