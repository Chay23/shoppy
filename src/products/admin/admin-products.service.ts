import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ProductsRepository } from '../products.repository';
import { CreateProductDto } from './dtos/create-product.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { productMessages } from '../messages/messages';
import slugify from 'slugify';
import { MultipartFile } from '@fastify/multipart';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Pagination } from 'src/common/decorators/pagination-params.decorator';
import { Prisma, Product } from 'generated/prisma';
import { PaginatedResponse } from 'src/types/paginated-response.interface';

@Injectable()
export class AdminProductsService {
  constructor(private productRepository: ProductsRepository) {}
  async create(data: CreateProductDto) {
    try {
      return await this.productRepository.create({
        data: {
          ...data,
          stock: data.stock || 0,
          slug: data.slug || slugify(data.name),
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
