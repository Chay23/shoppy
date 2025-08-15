import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export interface Search {
  q: string;
}

interface SearchQuery {
  q: string;
}

export const SearchParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Search => {
    const req = ctx
      .switchToHttp()
      .getRequest<FastifyRequest<{ Querystring: SearchQuery }>>();
    return { q: req.query.q };
  },
);
