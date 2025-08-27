import { Injectable, NotFoundException } from '@nestjs/common';
import { CartsRepository } from '../carts.repository';
import { CartIdentity } from '../guards/cart-identity.guard';
import { Cart, CartItem } from 'generated/prisma';
import { cartMessages } from '../messages/cart';
import { CartItemsRepository } from '../cart-items.repository';

@Injectable()
export class StoreCartsService {
  constructor(
    private cartsRepository: CartsRepository,
    private cartItemsRepository: CartItemsRepository,
  ) {}

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

  async mergeGuestCartIntoUser(guestToken: string, userId: number) {
    const [guestCart, userCart] = await Promise.all([
      await this.cartsRepository.findOne({
        where: {
          guestToken,
        },
        include: {
          items: true,
        },
      }),
      await this.cartsRepository.findOne({
        where: {
          userId,
        },
        include: {
          items: true,
        },
      }),
    ]);

    const targetCart =
      userCart ??
      (await this.cartsRepository.create({
        data: { userId, status: 'ACTIVE' },
        include: { items: true },
      }));

    if (!guestCart || guestCart.id === targetCart.id) return;

    for (const item of (guestCart as Cart & { items: CartItem[] }).items) {
      await this.cartItemsRepository.upsert({
        where: {
          cartId_productId: {
            cartId: targetCart.id,
            productId: item.productId,
          },
        },
        create: {
          cartId: targetCart.id,
          productId: item.productId,
          quantity: item.quantity,
        },
        update: {
          quantity: {
            increment: item.quantity,
          },
        },
      });
    }

    await this.cartsRepository.delete({
      where: {
        id: guestCart.id,
      },
    });
  }
}
