import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

interface RequestParams {
  id: string;
}

export const Id = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx
      .switchToHttp()
      .getRequest<FastifyRequest<{ Params: RequestParams }>>();
    return req.params.id;
  },
);
