import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

interface SearchQuery {
  q: string;
}

export const SearchParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const req = ctx
      .switchToHttp()
      .getRequest<FastifyRequest<{ Querystring: SearchQuery }>>();
    return req.query.q;
  },
);
