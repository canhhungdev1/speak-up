import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { GoogleLoginDto } from './dto/google-login.dto';
import { AuthResponseDto, UserProfileDto } from './dto/auth-response.dto';
import { SPEAKUP_EXCHANGE } from '../../infrastructure/rabbitmq/rabbitmq.module';
import { UserWelcomeMessage } from './consumers/user-email.consumer';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  /**
   * Xử lý đăng nhập / đăng ký bằng tài khoản Google.
   * - Nếu User mới lần đầu vào: Lưu vào PostgreSQL và bắn sự kiện qua RabbitMQ để gửi email chào mừng ngầm.
   * - Nếu User cũ đã có trong hệ thống: Bỏ qua bước gửi mail, đăng nhập ngay lập tức.
   */
  async loginWithGoogle(dto: GoogleLoginDto): Promise<AuthResponseDto> {
    const startTime = Date.now();
    const normalizedEmail = dto.email.trim().toLowerCase();

    // 1. Kiểm tra sự tồn tại của User trong PostgreSQL
    let user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      this.logger.log(`👤 Phát hiện người dùng mới: ${normalizedEmail}. Đang tiến hành tạo tài khoản...`);

      // 2. Tạo User mới trong Database
      user = await this.prisma.user.create({
        data: {
          email: normalizedEmail,
          name: dto.name || normalizedEmail.split('@')[0],
          avatarUrl: dto.avatarUrl || null,
          provider: 'google',
        },
      });

      this.logger.log(`💾 [Database] Đã lưu User mới thành công với ID: ${user.id}`);

      // 3. Kích hoạt RabbitMQ Event gửi email chào mừng bất đồng bộ
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

    // 4. Ánh xạ sang UserProfileDto để bảo mật (không trả thẳng Model của DB)
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
