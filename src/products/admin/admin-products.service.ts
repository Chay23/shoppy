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

@Injectable()
export class AdminProductsService {
  constructor(private productRepository: ProductsRepository) {}
  async create(data: CreateProductDto) {
    try {
      return await this.productRepository.create({
        data: {
          ...data,
          slug: data.slug || slugify(data.name),
        },
      });
    } catch (err) {
      console.log(err);
      if ((err as PrismaClientKnownRequestError).code === 'P2002') {
        throw new UnprocessableEntityException(productMessages.SlugInUse());
      }
      if ((err as PrismaClientKnownRequestError).code === 'P2003') {
        throw new BadRequestException(
          productMessages.CategoryDoesNotExist(data.categoryId),
        );
      }
      throw err;
    }
  }
}
