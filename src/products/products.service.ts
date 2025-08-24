import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { Pagination } from 'src/common/decorators/pagination-params.decorator';
import { Prisma, Product } from 'generated/prisma';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { ProductsRepository } from './products.repository';
import { productMessages } from './messages/messages';

@Injectable()
export class ProductsService {
  constructor(private productRepository: ProductsRepository) {}

  async findAll(
    pagination: Pagination,
    query: string,
  ): Promise<PaginatedResponse<Partial<Product>>> {
    const { offset, limit } = pagination;
    const where: Prisma.ProductWhereInput = {};

    if (query) {
      where.name = {
        contains: query,
        mode: 'insensitive',
      };
    }

    const items = await this.productRepository.findAll({
      skip: offset,
      take: limit,
    });

    const count = await this.productRepository.count({ where });

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
        throw new UnprocessableEntityException(
          productMessages.ProductNotFound(id),
        );
      }
      throw err;
    }
  }
}
