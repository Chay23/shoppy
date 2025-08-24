import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'generated/prisma';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { TokenPayload } from 'src/common/interfaces/auth.interface';
import { getCurrentUserByContext } from 'src/common/utils/user.utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const userPayload = getCurrentUserByContext<TokenPayload>(context);

    return requiredRoles.includes(userPayload.role);
  }
}
