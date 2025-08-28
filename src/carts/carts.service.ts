import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart, Prisma } from 'generated/prisma';
import { CartsRepository } from './carts.repository';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { cartMessages } from './messages/cart';
import { CartIdentity } from './guards/cart-identity.guard';

@Injectable()
export class CartsService {
  constructor(private cartsRepository: CartsRepository) {}
  
  async getCart(
    cartIdentity: CartIdentity,
    args?: Omit<Prisma.CartFindUniqueArgs, 'where'>,
  ) {
    if (cartIdentity.userId) {
      return await this.cartsRepository.findOne({
        where: {
          userId: cartIdentity.userId,
        },
        ...args,
      });
    }

    if (cartIdentity.guestToken) {
      return await this.cartsRepository.findOne({
        where: {
          guestToken: cartIdentity.guestToken,
        },
        ...args,
      });
    }
  }

  async update(id: string, data: Partial<Cart>) {
    try {
      return await this.cartsRepository.update({
        where: {
          id,
        },
        data,
      });
    } catch (err) {
      if ((err as PrismaClientKnownRequestError).code === 'P2025') {
        throw new NotFoundException(cartMessages.CartNotFound());
      }
      throw err;
    }
  }
}
