import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import slugify from 'slugify';
import { CategoriesRepository } from './categories.repository';
import { Category, Prisma } from 'generated/prisma';
import { Pagination } from 'src/common/decorators/pagination-params.decorator';
import { Search } from 'src/common/decorators/search-param.decorator';
import { PaginatedResponse } from 'src/types/paginated-response.interface';

@Injectable()
export class CategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async adminList(
    pagination: Pagination,
    search: Search,
  ): Promise<PaginatedResponse<Partial<Category>>> {
    const where: Prisma.CategoryWhereInput = {};

    if (search.q) {
      where.name = {
        contains: search.q,
        mode: 'insensitive',
      };
    }

    const items = await this.categoriesRepository.findAll({
      where,
      skip: pagination.offset,
      take: pagination.limit,
    });
    const count = await this.categoriesRepository.count({ where });

    return { count, offset: pagination.offset, limit: pagination.limit, items };
  }

  async create(data: CreateCategoryDto) {
    try {
      const slug =
        data.slug ||
        slugify(data.name, {
          lower: true,
        });
      return await this.categoriesRepository.create({
        data: {
          ...data,
          slug,
        },
        select: {
          name: true,
          slug: true,
        },
      });
    } catch (err) {
      if (((err as PrismaClientKnownRequestError).code = 'P2002')) {
        throw new UnprocessableEntityException('Slug already in use');
      }
    }
  }
}
