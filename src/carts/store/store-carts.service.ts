import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartsRepository } from '../carts.repository';
import { AddItemDto } from './dtos/add-item.dto';
import { CartIdentity } from '../guards/cart-identity.guard';
import { productMessages } from 'src/products/messages/messages';
import { CartItemsRepository } from '../cart-items.repository';
import { Cart } from 'generated/prisma';
import { cartMessages } from '../messages/cart';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class StoreCartsService {
  constructor(
    private cartsRepository: CartsRepository,
    private cartItemsRepository: CartItemsRepository,
    private productsService: ProductsService,
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

  async addItem(cartIdentity: CartIdentity, data: AddItemDto) {
    await this.productsService.findOne(data.productId);
    const cart = await this.resolveOrCreateCart(cartIdentity);

    const item = this.cartItemsRepository.upsert({
      where: {
        cartId: cart.id,
        productId: data.productId,
      },
      create: {
        cartId: cart.id,
        productId: data.productId,
        quantity: data.quantity,
      },
      update: {
        quantity: { increment: data.quantity },
      },
    });

    return item;
  }
}
