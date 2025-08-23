import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import slugify from 'slugify';
import { CategoriesRepository } from '../categories.repository';
import { Category, Prisma } from 'generated/prisma';
import { Pagination } from 'src/common/decorators/pagination-params.decorator';
import { PaginatedResponse } from 'src/types/paginated-response.interface';
import { categoriesMessages } from 'src/categories/messages/messages';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class AdminCategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async findAll(
    pagination: Pagination,
    query: string,
  ): Promise<PaginatedResponse<Partial<Category>>> {
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
    });
    const count = await this.categoriesRepository.count({ where });

    return { count, offset: pagination.offset, limit: pagination.limit, items };
  }

  async findOne(id: number) {
    try {
      return await this.categoriesRepository.findOne({
        where: {
          id,
        },
      });
    } catch (err) {
      if ((err as PrismaClientKnownRequestError).code === 'P2025') {
        throw new NotFoundException(categoriesMessages.NotFound(id));
      }
    }
  }

  async update(id: number, data: UpdateCategoryDto) {
    try {
      return await this.categoriesRepository.update({
        where: {
          id,
        },
        data,
      });
    } catch (err) {
      if ((err as PrismaClientKnownRequestError).code === 'P2025') {
        throw new NotFoundException(categoriesMessages.NotFound(id));
      }
    }
  }

  async deleteSingle(id: number) {
    try {
      return await this.categoriesRepository.delete({
        where: {
          id,
        },
      });
    } catch (err) {
      if ((err as PrismaClientKnownRequestError).code === 'P2025') {
        throw new NotFoundException(categoriesMessages.NotFound(id));
      }
    }
  }

  async create(data: CreateCategoryDto) {
    try {
      return await this.categoriesRepository.create({
        data: {
          ...data,
          slug:
            data.slug ||
            slugify(data.name, {
              lower: true,
            }),
        },
        select: {
          name: true,
          slug: true,
        },
      });
    } catch (err) {
      if (((err as PrismaClientKnownRequestError).code = 'P2002')) {
        throw new UnprocessableEntityException(categoriesMessages.SlugInUse());
      }
    }
  }
}
