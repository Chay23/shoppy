import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { User } from 'generated/prisma';

declare module 'fastify' {
  interface FastifyRequest {
    user: User;
  }
}

export const getCurrentUserByContext = (context: ExecutionContext) => {
  const req: FastifyRequest = context.switchToHttp().getRequest();
  return req.user;
};

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
