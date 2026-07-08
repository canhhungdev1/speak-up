import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async googleLogin(token: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        // audience: process.env.GOOGLE_CLIENT_ID, // Bỏ comment khi có Client ID thật để tăng cường bảo mật
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid Google token payload');
      }

      const { email, sub: googleId, name: fullName, picture: avatarUrl } = payload;

      // Find or create user
      let user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        // Update googleId if missing
        if (!user.googleId) {
          user = await this.prisma.user.update({
            where: { email },
            data: { googleId, avatarUrl: user.avatarUrl || avatarUrl },
          });
        }
      } else {
        // Create new user
        user = await this.prisma.user.create({
          data: {
            email,
            googleId,
            fullName,
            avatarUrl,
          },
        });
      }

      // Generate JWT
      const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });

      return {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
        },
      };
    } catch (error) {
      console.error('Google Auth Error:', error);
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}
