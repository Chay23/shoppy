import { Injectable, NotFoundException } from '@nestjs/common';
import { StoreCartsService } from './store-carts.service';
import { ProductsService } from 'src/products/products.service';
import { CartItemsRepository } from '../cart-items.repository';
import { CartIdentity } from '../guards/cart-identity.guard';
import { AddItemDto } from './dtos/add-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { cartItemsMessages } from '../messages/cart-items';

interface CartItemNotFoundData {
  productId: number;
}

@Injectable()
export class StoreCartItemsService {
  constructor(
    private storeCartsService: StoreCartsService,
    private cartItemsRepository: CartItemsRepository,
    private productsService: ProductsService,
  ) {}

  handleCartItemsError(err: PrismaClientKnownRequestError, data: unknown) {
    switch (err.code) {
      case 'P2025': {
        throw new NotFoundException(
          cartItemsMessages.ItemNotFound(
            (data as CartItemNotFoundData).productId,
          ),
        );
      }
    }
  }

  async addItem(cartIdentity: CartIdentity, data: AddItemDto) {
    await this.productsService.findOne(data.productId);
    const cart = await this.storeCartsService.resolveOrCreateCart(cartIdentity);

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

  async updateItemQuantity(
    cartIdentity: CartIdentity,
    productId: number,
    data: UpdateItemDto,
  ) {
    const cart = await this.storeCartsService.resolveOrCreateCart(cartIdentity);
    try {
      return await this.cartItemsRepository.update({
        where: {
          cartId: cart.id,
          productId,
        },
        data,
      });
    } catch (err) {
      this.handleCartItemsError(err, { productId });
    }
  }

  async deleteItem(cartIdentity: CartIdentity, productId: number) {
    const cart = await this.storeCartsService.resolveOrCreateCart(cartIdentity);
    try {
      return await this.cartItemsRepository.delete({
        where: {
          cartId: cart.id,
          productId,
        },
      });
    } catch (err) {
      this.handleCartItemsError(err, { productId });
    }
  }

  async deleteAllItems(cartIdentity: CartIdentity) {
    const cart = await this.storeCartsService.resolveOrCreateCart(cartIdentity);
    return await this.cartItemsRepository.deleteMany({
      where: {
        cartId: cart.id,
      },
    });
  }
}
