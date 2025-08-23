import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ProductsRepository } from '../products.repository';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { productMessages } from '../messages/messages';

@Injectable()
export class StoreProductsService {
  constructor(private productRepository: ProductsRepository) {}

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
