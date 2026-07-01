import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // Nếu không yêu cầu Role nào thì cho phép đi tiếp
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.userId) {
      return false; // Chưa đăng nhập
    }

    // Tra cứu role thực tế trong Database Local
    const dbUser = await this.prisma.user.findUnique({
      where: { authProviderId: user.userId },
    });

    if (!dbUser) {
      return false;
    }

    return requiredRoles.includes(dbUser.role);
  }
}
