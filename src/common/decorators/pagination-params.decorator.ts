import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export interface Pagination {
  offset: number;
  limit: number;
}

interface PaginationQuery {
  offset: string;
  limit: string;
}

export const PaginationParams = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Pagination => {
    const req = ctx
      .switchToHttp()
      .getRequest<FastifyRequest<{ Querystring: PaginationQuery }>>();
    const offset = parseInt(req.query.offset);
    const limit = parseInt(req.query.limit);

    if (isNaN(offset) || offset < 0 || isNaN(limit) || limit < 0) {
      throw new BadRequestException('Invalid pagination params');
    }

    if (limit > 100) {
      throw new BadRequestException(
        'Invalid pagination params: Max limit is 100',
      );
    }

    return { offset, limit };
  },
);
