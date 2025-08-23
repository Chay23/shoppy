import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

interface RequestParams {
  slug: string;
}

export const Slug = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest<FastifyRequest<{ Params: RequestParams }>>()
      .params.slug,
);
