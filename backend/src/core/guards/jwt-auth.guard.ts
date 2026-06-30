import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../../infrastructure/supabase/supabase.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    const logPath = path.join(process.cwd(), 'jwt-debug.log');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      fs.appendFileSync(logPath, `\n[${new Date().toISOString()}] LỖI: Không có Token trong header! Headers: ${JSON.stringify(request.headers)}\n`);
      throw new UnauthorizedException('Thiếu Token xác thực');
    }

    const token = authHeader.split(' ')[1];

    try {
      const { data, error } = await this.supabaseService.getClient().auth.getUser(token);

      if (error || !data.user) {
        fs.appendFileSync(logPath, `\n[${new Date().toISOString()}] LỖI: Token không hợp lệ. Error từ Supabase: ${JSON.stringify(error)}. Token: ${token}\n`);
        throw new UnauthorizedException('Token không hợp lệ');
      }

      fs.appendFileSync(logPath, `\n[${new Date().toISOString()}] THÀNH CÔNG: Đã xác thực user ${data.user.email}\n`);
      request.user = {
        userId: data.user.id,
        email: data.user.email,
        role: data.user.role,
      };

      return true;
    } catch (err) {
      fs.appendFileSync(logPath, `\n[${new Date().toISOString()}] LỖI EXCEPTION: ${err}\n`);
      throw new UnauthorizedException('Không thể xác thực');
    }
  }
}
