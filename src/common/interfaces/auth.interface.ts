import { UserRole } from 'generated/prisma';

declare module 'fastify' {
  interface FastifyRequest {
    user: unknown;
  }
}

export interface TokenPayload {
  userId: number;
  role: UserRole;
}
