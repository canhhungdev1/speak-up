import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleLoginDto } from './dto/google-login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint tiếp nhận đăng nhập / đăng ký bằng tài khoản Google
   * POST /api/v1/auth/google
   */
  @Post('google')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async googleLogin(@Body() dto: GoogleLoginDto): Promise<AuthResponseDto> {
    return this.authService.loginWithGoogle(dto);
  }
}
