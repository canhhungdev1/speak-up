import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { GoogleLoginDto } from './dto/google-login.dto';
import { AuthResponseDto, UserProfileDto } from './dto/auth-response.dto';
import { SPEAKUP_EXCHANGE } from '../../infrastructure/rabbitmq/rabbitmq.module';
import { UserWelcomeMessage } from './consumers/user-email.consumer';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly googleClient: OAuth2Client;
  private readonly googleClientId: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly amqpConnection: AmqpConnection,
    private readonly configService: ConfigService,
  ) {
    this.googleClientId = this.configService.get<string>(
      'GOOGLE_CLIENT_ID',
      '996712067238-iuk0jcbrfjfcupqs4re96i1f2m8bg8hk.apps.googleusercontent.com',
    );
    this.googleClient = new OAuth2Client(this.googleClientId);
  }

  /**
   * Xử lý đăng nhập / đăng ký bằng tài khoản Google.
   * - Xác thực tính toàn vẹn của Google ID Token (hoặc fallback dev email nếu dùng chế độ mock).
   * - Nếu User mới lần đầu vào: Lưu vào PostgreSQL và bắn sự kiện qua RabbitMQ để gửi email chào mừng ngầm.
   * - Nếu User cũ đã có trong hệ thống: Bỏ qua bước gửi mail, đăng nhập ngay lập tức.
   */
  async loginWithGoogle(dto: GoogleLoginDto): Promise<AuthResponseDto> {
    const startTime = Date.now();
    let email: string;
    let name: string | null = null;
    let avatarUrl: string | null = null;

    // 1. Xác thực Google ID Token (Chuẩn bảo mật Production)
    if (dto.idToken) {
      try {
        this.logger.log('🔑 Đang xác thực Google ID Token với máy chủ chứng thực Google...');
        const ticket = await this.googleClient.verifyIdToken({
          idToken: dto.idToken,
          audience: this.googleClientId,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
          throw new UnauthorizedException('Google ID Token không chứa thông tin email hợp lệ');
        }

        email = payload.email.trim().toLowerCase();
        name = payload.name || email.split('@')[0];
        avatarUrl = payload.picture || null;

        this.logger.log(`✅ Xác thực Google ID Token thành công: ${email} (${name})`);
      } catch (error) {
        this.logger.error(`❌ Xác thực Google ID Token thất bại: ${error.message}`);
        throw new UnauthorizedException('Google ID Token không hợp lệ hoặc đã hết hạn');
      }
    } else if (dto.email) {
      // Chế độ Dev testing dự phòng khi gọi trực tiếp qua Postman/Curl
      email = dto.email.trim().toLowerCase();
      name = dto.name || email.split('@')[0];
      avatarUrl = dto.avatarUrl || null;
      this.logger.warn(`⚠️ [Dev Mode] Đăng nhập bằng Email trực tiếp không qua Google Token: ${email}`);
    } else {
      throw new BadRequestException('Vui lòng cung cấp Google ID Token hoặc Email hợp lệ');
    }

    // 2. Kiểm tra sự tồn tại của User trong PostgreSQL
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      this.logger.log(`👤 Phát hiện người dùng mới: ${email}. Đang tiến hành tạo tài khoản...`);

      // 3. Tạo User mới trong Database
      user = await this.prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          avatarUrl: avatarUrl || null,
          provider: 'google',
        },
      });

      this.logger.log(`💾 [Database] Đã lưu User mới thành công với ID: ${user.id}`);

      // 4. Kích hoạt RabbitMQ Event gửi email chào mừng bất đồng bộ
      const welcomePayload: UserWelcomeMessage = {
        id: user.id,
        email: user.email,
        name: user.name,
        registeredAt: user.createdAt.toISOString(),
      };

      await this.amqpConnection.publish(
        SPEAKUP_EXCHANGE,
        'user.welcome',
        welcomePayload,
      );

      this.logger.log(
        `📤 [Producer -> RabbitMQ] Đã bắn sự kiện "user.welcome" tới Exchange "${SPEAKUP_EXCHANGE}"`,
      );
    } else {
      this.logger.log(`🔑 Người dùng cũ đăng nhập: ${user.email} (ID: ${user.id}). Bỏ qua gửi email chào mừng.`);
    }

    const elapsedMs = Date.now() - startTime;

    // 5. Ánh xạ sang UserProfileDto để bảo mật (không trả thẳng Model của DB)
    const userProfile: UserProfileDto = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      provider: user.provider,
      createdAt: user.createdAt.toISOString(),
    };

    return {
      statusCode: isNewUser ? 201 : 200,
      message: isNewUser
        ? '🎉 Chào mừng bạn lần đầu đến với SpeakUp! Email quà tặng chào mừng đang được gửi ngầm.'
        : '👋 Chào mừng bạn quay trở lại với SpeakUp!',
      isNewUser,
      user: userProfile,
      meta: {
        asyncEmailTriggered: isNewUser,
        messageBroker: isNewUser ? 'RabbitMQ' : undefined,
      },
    };
  }

  /**
   * Lấy thông tin User theo ID (dành cho kiểm tra profile)
   */
  async getUserById(id: string): Promise<UserProfileDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      provider: user.provider,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
