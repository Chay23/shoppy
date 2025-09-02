import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ProductsRepository } from '../products.repository';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { productMessages } from '../messages/messages';
import { Pagination } from 'src/common/decorators/pagination-params.decorator';
import { Sorting } from 'src/common/decorators/sorting-params.decorator';
import { Prisma } from 'generated/prisma';
import { CategoriesRepository } from 'src/categories/categories.repository';
import { categoriesMessages } from 'src/categories/messages/messages';
import { ProductsService } from '../products.service';
import { ProductsFiltersDto } from './dtos/products-filters.dto';

@Injectable()
export class StoreProductsService {
  constructor(
    private productRepository: ProductsRepository,
    private productsService: ProductsService,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async findAll({
    pagination,
    sort,
    queryParams,
    searchQuery,
    categorySlug,
  }: {
    pagination: Pagination;
    sort: Sorting;
    queryParams: ProductsFiltersDto;
    searchQuery?: string;
    categorySlug?: string;
  }) {
    const where: Prisma.ProductWhereInput = {};

    if (categorySlug) {
      const category = await this.categoriesRepository.findOne({
        where: {
          slug: categorySlug,
        },
      });

      if (!category) {
        throw new NotFoundException(
          categoriesMessages.NotFoundBySlug(categorySlug),
        );
      }
      where.categoryId = category.id;
    }

    if (queryParams.price) {
      where.price = queryParams.price;
    }

    return this.productsService.findAllPaginated({
      pagination,
      sort,
      searchQuery,
      args: {
        where,
      },
    });
  }

  async findOnyBySlug(slug: string) {
    try {
      return await this.productRepository.findOne({
        where: {
          slug,
        },
      });
    } catch (err) {
      if ((err as PrismaClientKnownRequestError).code === 'P2025') {
        throw new UnprocessableEntityException(
          productMessages.ProductNotFoundBySlug(slug),
        );
      }
      throw err;
    }
  }
}
