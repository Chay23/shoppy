import { ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const getCurrentUserByContext = <T = unknown>(
  context: ExecutionContext,
): T => {
  const req = context.switchToHttp().getRequest<FastifyRequest>();
  return req.user as T;
};
