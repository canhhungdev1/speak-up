import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthDto } from './dto/google-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleAuth(@Body() googleAuthDto: GoogleAuthDto) {
    const result = await this.authService.authenticateWithGoogle(googleAuthDto.idToken);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Đăng nhập với Google thành công',
      data: result,
    };
  }
}
