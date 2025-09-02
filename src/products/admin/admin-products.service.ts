import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ProductsRepository } from '../products.repository';
import { CreateProductDto } from './dtos/create-product.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { productMessages } from '../messages/messages';
import slugify from 'slugify';
import { MultipartFile } from '@fastify/multipart';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Prisma } from 'generated/prisma';
import { Pagination } from 'src/common/decorators/pagination-params.decorator';
import { Sorting } from 'src/common/decorators/sorting-params.decorator';
import { CategoriesRepository } from 'src/categories/categories.repository';
import { ProductsService } from '../products.service';
import { categoriesMessages } from 'src/categories/messages/messages';

@Injectable()
export class AdminProductsService {
  constructor(
    private productRepository: ProductsRepository,
    private productsService: ProductsService,
    private categoriesRepository: CategoriesRepository,
  ) {}
  async create(data: CreateProductDto) {
    try {
      return await this.productRepository.create({
        data: {
          ...data,
          stock: data.stock || 0,
          slug:
            data.slug ||
            slugify(data.name, {
              lower: true,
            }),
        },
      });
    } catch (err) {
      if ((err as PrismaClientKnownRequestError).code === 'P2002') {
        throw new UnprocessableEntityException(productMessages.SlugInUse());
      }
      if ((err as PrismaClientKnownRequestError).code === 'P2003') {
        throw new BadRequestException(
          productMessages.CategoryNotFound(data.categoryId),
        );
      }
      throw err;
    }
  }

  async updateMainImage(id: number, imageFile: MultipartFile) {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });

    if (!product) {
      throw new BadRequestException(productMessages.ProductNotFound(id));
    }

    return this.productRepository.update({
      data: {
        mainImageUrl: imageFile.filename,
      },
      where: {
        id,
      },
    });
  }

  async updateImages(id: number, imageFiles: MultipartFile[]) {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });

    if (!product) {
      throw new BadRequestException(productMessages.ProductNotFound(id));
    }

    const fileNames = imageFiles.map((file) => file.filename);
    return this.productRepository.update({
      data: {
        imageUrls: [...product.imageUrls, ...fileNames],
      },
      where: {
        id,
      },
    });
  }

  async findAll({
    pagination,
    sort,
    searchQuery,
    categoryId,
  }: {
    pagination: Pagination;
    sort: Sorting;
    searchQuery?: string;
    categoryId?: number;
  }) {
    const where: Prisma.ProductWhereInput = {};

    if (categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: {
          id: categoryId,
        },
      });

      if (!category) {
        throw new NotFoundException(
          categoriesMessages.NotFoundById(categoryId),
        );
      }
      where.categoryId = category.id;
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

  async update(id: number, data: UpdateProductDto) {
    try {
      return await this.productRepository.update({
        where: {
          id,
        },
        data,
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

  async deleteOne(id: number) {
    try {
      return await this.productRepository.deleteOne({
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
