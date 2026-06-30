import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('SUPABASE_JWT_SECRET') || 'default_secret';
    // Đảm bảo secret không có dấu nháy kép thừa
    const cleanSecret = secret.replace(/^"|"$/g, '');
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cleanSecret, // Dùng cleanSecret để tránh lỗi nháy kép
    });
  }

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException();
    }
    // Payload là cục dữ liệu bên trong Token của Supabase (chứa sub, email, v.v...)
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
