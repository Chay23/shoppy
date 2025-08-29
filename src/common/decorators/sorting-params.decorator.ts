import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { getCurrentRequestByContext } from '../utils/decorators.utils';
import { FastifyRequest } from 'fastify';

export type SortDirection = 'asc' | 'desc';

export interface Sorting {
  property: string;
  direction: SortDirection;
}

interface SortingQuery {
  sort?: string;
}

interface RequestWithSortingQuery
  extends FastifyRequest<{ Querystring: SortingQuery }> {}

export const SortingParams = (allowedFields: string[]) =>
  createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const req = getCurrentRequestByContext<RequestWithSortingQuery>(ctx);

    const sort = req.query.sort;

    if (!sort) {
      return undefined;
    }

    const sortPattern = /^([a-zA-Z0-9]+):(asc|desc)$/;

    if (!sort.match(sortPattern))
      throw new BadRequestException('Invalid sort parameter');

    const [property, direction] = sort.split(':');

    console.log(allowedFields);
    console.log(property);

    if (!allowedFields.includes(property))
      throw new BadRequestException(`Invalid sort property: ${property}`);

    return { property, direction };
  })();
