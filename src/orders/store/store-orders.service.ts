import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrdersRepository } from '../orders.repository';
import { CartIdentity } from 'src/carts/guards/cart-identity.guard';
import { CreateOrderDto } from './dtos/create-order.dto';
import { CartsService } from 'src/carts/carts.service';
import { ShippingInfosService } from 'src/shipping-infos/shipping-infos.service';
import { BillingInfosService } from 'src/billing-infos/billing-infos.service';
import { Cart, CartItem, Prisma, Product } from 'generated/prisma';
import { ordersMessages } from '../messages/ordersMessages';
import { FastifyReply } from 'fastify';
import { CART_TOKEN_COOKIE } from 'src/common/constants/cookies';

interface CartWithProductItems extends Cart {
  items: (CartItem & { product: Product })[];
}

@Injectable()
export class StoreOrdersService {
  constructor(
    private ordersRepository: OrdersRepository,
    private shippingInfosService: ShippingInfosService,
    private billingInfosService: BillingInfosService,
    private cartsService: CartsService,
  ) {}

  async placeOrder(
    cartIdentity: CartIdentity,
    orderData: CreateOrderDto,
    res: FastifyReply,
  ) {
    const cart = await this.cartsService.getCart(cartIdentity, {
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return new NotFoundException(ordersMessages.NoCartFound());
    }

    if ((cart as CartWithProductItems).items.length === 0) {
      return new BadRequestException(ordersMessages.NoCartItems());
    }

    const shippingInfo = await this.shippingInfosService.create(
      orderData.shippingInfo,
    );
    const billingInfo = await this.billingInfosService.create(
      orderData.billingInfo,
    );

    const data: Prisma.OrderUncheckedCreateInput = {
      email: orderData.email,
      status: 'PENDING',
      billingInfoId: billingInfo.id,
      shippingInfoId: shippingInfo.id,
      items: {
        create: (cart as CartWithProductItems).items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          productPrice: item.product.price,
          quantity: item.quantity,
        })),
      },
    };

    if (cart.userId) {
      data.userId = cart.userId;
    }

    const order = await this.ordersRepository.create({
      data,
    });

    this.cartsService.update(cart.id, {
      status: 'COMPLETED',
    });

    if (cartIdentity.guestToken) {
      res.clearCookie(CART_TOKEN_COOKIE);
    }

    return order;
  }
}
