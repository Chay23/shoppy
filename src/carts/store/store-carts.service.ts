import { Injectable, NotFoundException } from '@nestjs/common';
import { CartsRepository } from '../carts.repository';
import { CartIdentity } from '../guards/cart-identity.guard';
import { Cart, CartItem } from 'generated/prisma';
import { cartMessages } from '../messages/cart';
import { CartItemsRepository } from '../cart-items.repository';
import { CartsService } from '../carts.service';
import { FastifyReply } from 'fastify';
import { CART_TOKEN_COOKIE } from 'src/common/constants/cookies';

@Injectable()
export class StoreCartsService {
  constructor(
    private cartsRepository: CartsRepository,
    private cartItemsRepository: CartItemsRepository,
    private cartsService: CartsService,
  ) {}

  async resolveOrCreateCart(cartIdentity: CartIdentity): Promise<Cart> {
    if (!cartIdentity.userId && !cartIdentity.guestToken) {
      throw new NotFoundException(cartMessages.NoRelatedCart());
    }

    let cart = await this.cartsService.getCart(cartIdentity);

    const cartData: Partial<Cart> = {
      status: 'ACTIVE',
    };

    if (!cart) {
      if (cartIdentity.userId) {
        cartData.userId = cartIdentity.userId;
      }

      if (cartIdentity.guestToken) {
        cartData.guestToken = cartIdentity.guestToken;
      }

      cart = await this.cartsRepository.create({
        data: cartData,
      });
    }

    return cart;
  }

  async mergeGuestCartIntoUser(
    res: FastifyReply,
    guestToken: string,
    userId: number,
  ) {
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

    res.clearCookie(CART_TOKEN_COOKIE);
  }
}
