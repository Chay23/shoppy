import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../categories.repository';
import { Prisma } from 'generated/prisma';
import { Pagination } from 'src/common/decorators/pagination-params.decorator';

@Injectable()
export class StoreCategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}
  async list(pagination: Pagination, query: string) {
    const where: Prisma.CategoryWhereInput = {};

    if (query) {
      where.name = {
        contains: query,
        mode: 'insensitive',
      };
    }

    const items = await this.categoriesRepository.findAll({
      where,
      skip: pagination.offset,
      take: pagination.limit,
      select: {
        id: true,
        name: true,
        slug: true,
        products: true,
      },
    });
    const count = await this.categoriesRepository.count({ where });

    return { count, offset: pagination.offset, limit: pagination.limit, items };
  }
}
