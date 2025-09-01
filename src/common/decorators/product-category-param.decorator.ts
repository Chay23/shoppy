import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getCurrentRequestByContext } from '../utils/decorators.utils';
import { FastifyRequest } from 'fastify';

interface CategoryQuery {
  category: string;
}

interface RequestWithCategoryQuery
  extends FastifyRequest<{ Querystring: CategoryQuery }> {}

export const ProductCategoryParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) =>
    getCurrentRequestByContext<RequestWithCategoryQuery>(ctx).query.category,
);
