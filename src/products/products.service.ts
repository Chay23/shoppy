import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { Pagination } from 'src/common/decorators/pagination-params.decorator';
import { Prisma, Product } from 'generated/prisma';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { ProductsRepository } from './products.repository';
import { productMessages } from './messages/messages';
import { Sorting } from 'src/common/decorators/sorting-params.decorator';

@Injectable()
export class ProductsService {
  constructor(private productRepository: ProductsRepository) {}

  async findAllPaginated({
    pagination,
    sort,
    searchQuery,
    args,
  }: {
    pagination: Pagination;
    sort: Sorting;
    searchQuery?: string;
    args: Omit<Prisma.ProductFindManyArgs, 'orderBy' | 'skip' | 'take'>;
  }): Promise<PaginatedResponse<Partial<Product>>> {
    const { offset, limit } = pagination;
    const where: Prisma.ProductWhereInput = { ...args.where };
    const orderBy: Prisma.ProductOrderByWithRelationInput = {};

    if (searchQuery) {
      where.name = {
        contains: searchQuery,
        mode: 'insensitive',
      };
    }

    if (sort) {
      orderBy[sort.property] = sort.direction;
    }

    const [items, count] = await Promise.all([
      await this.productRepository.findAll({
        where,
        orderBy,
        skip: offset,
        take: limit,
      }),
      await this.productRepository.count({ where, orderBy }),
    ]);

    return { count, offset, limit, items };
  }

  async findOne(id: number) {
    try {
      return await this.productRepository.findOne({
        where: {
          id,
        },
      });
    } catch (err) {
      if ((err as PrismaClientKnownRequestError).code === 'P2025') {
        throw new NotFoundException(productMessages.ProductNotFound(id));
      }
      throw err;
    }
  }
}
