import { CanActivate, ExecutionContext } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { FastifyRequest, FastifyReply } from 'fastify';
import { CART_TOKEN_COOKIE } from 'src/common/constants/cookies';
import { TokenPayload } from 'src/common/interfaces/auth.interface';

export interface CartIdentity {
  userId?: number;
  guestToken?: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    cart?: CartIdentity;
  }
}

export class CartIdentityGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<FastifyRequest>();

    const tokenPayload = req.user as TokenPayload;

    if (tokenPayload) {
      req.cart = {
        userId: tokenPayload.userId,
      };
    } else {
      let guestToken = req.cookies[CART_TOKEN_COOKIE];

      if (!guestToken) {
        guestToken = randomUUID();
        const res = context.switchToHttp().getResponse<FastifyReply>();
        res.setCookie(CART_TOKEN_COOKIE, guestToken, {
          secure: true,
          httpOnly: true,
          path: '/',
        });
      }

      req.cart = { guestToken };
    }

    return true;
  }
}
