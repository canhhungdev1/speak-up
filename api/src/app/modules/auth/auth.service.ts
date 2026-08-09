import { Injectable, UnauthorizedException, InternalServerErrorException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../../prisma/prisma.service';
import { Provider } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private googleClient: OAuth2Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {
    const clientId = process.env.GOOGLE_CLIENT_ID || '334154088956-iv10ov32isau8o2c0mbt85qt3cf6dgkm.apps.googleusercontent.com';
    this.googleClient = new OAuth2Client(clientId);
  }

  async authenticateWithGoogle(idToken: string) {
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID || '334154088956-iv10ov32isau8o2c0mbt85qt3cf6dgkm.apps.googleusercontent.com';
      
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: clientId,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Token Google không chứa thông tin email hợp lệ');
      }

      const { sub: googleId, email, name, picture: avatarUrl } = payload;
      this.logger.log(`Xác thực thành công người dùng Google: ${email}`);

      // Tìm kiếm user hiện tại hoặc tạo mới
      let user: any = null;
      try {
        user = await this.prisma.user.findFirst({
          where: {
            OR: [
              { googleId },
              { email },
            ],
          },
        });

        if (!user) {
          user = await this.prisma.user.create({
            data: {
              email,
              name: name || email.split('@')[0],
              avatarUrl,
              googleId,
              provider: Provider.GOOGLE,
            },
          });
          this.logger.log(`Tạo người dùng mới từ Google Auth ID: ${user.id}`);
        } else if (!user.googleId) {
          user = await this.prisma.user.update({
            where: { id: user.id },
            data: {
              googleId,
              provider: Provider.GOOGLE,
              avatarUrl: avatarUrl || user.avatarUrl,
            },
          });
        }
      } catch (dbError: any) {
        this.logger.warn(`Truy vấn Database thất bại (DB chưa sẵn sàng): ${dbError.message}`);
        // Fallback user object khi DB chưa bật trong môi trường dev
        user = {
          id: `usr_${googleId.slice(-8)}`,
          email,
          name: name || email.split('@')[0],
          avatarUrl,
          provider: Provider.GOOGLE,
        };
      }

      // Sinh JWT AccessToken & RefreshToken
      const jwtPayload = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(jwtPayload, {
        expiresIn: '7d',
      });
      const refreshToken = this.jwtService.sign(jwtPayload, {
        expiresIn: '30d',
      });

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          provider: user.provider,
        },
      };
    } catch (error: any) {
      this.logger.error(`Lỗi xác thực Google Token: ${error.message}`, error.stack);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Xác thực Token Google thất bại: Token không hợp lệ hoặc đã hết hạn');
    }
  }
}
