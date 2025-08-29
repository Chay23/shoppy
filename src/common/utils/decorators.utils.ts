import { ExecutionContext } from '@nestjs/common';

export const getCurrentRequestByContext = <T>(ctx: ExecutionContext) =>
  ctx.switchToHttp().getRequest<T>();
