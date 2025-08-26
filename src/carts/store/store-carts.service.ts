import { Injectable, NotFoundException } from '@nestjs/common';
import { CartsRepository } from '../carts.repository';
import { CartIdentity } from '../guards/cart-identity.guard';
import { CartItemsRepository } from '../cart-items.repository';
import { Cart } from 'generated/prisma';
import { cartMessages } from '../messages/cart';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class StoreCartsService {
  constructor(private cartsRepository: CartsRepository) {}

  async resolveOrCreateCart(cartIdentity: CartIdentity): Promise<Cart> {
    if (cartIdentity.userId) {
      let cart = await this.cartsRepository.findOne({
        where: {
          userId: cartIdentity.userId,
        },
      });
      if (!cart) {
        cart = await this.cartsRepository.create({
          data: {
            userId: cartIdentity.userId,
            status: 'ACTIVE',
          },
        });
      }
      return cart;
    }

    if (cartIdentity.guestToken) {
      let cart = await this.cartsRepository.findOne({
        where: {
          guestToken: cartIdentity.guestToken,
        },
      });
      if (!cart) {
        cart = await this.cartsRepository.create({
          data: {
            guestToken: cartIdentity.guestToken,
            status: 'ACTIVE',
          },
        });
      }
      return cart;
    }

    throw new NotFoundException(cartMessages.NoRelatedCart());
  }
}
