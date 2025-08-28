import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optiona-jwt-auth.guard';
import {
  CartIdentity,
  CartIdentityGuard,
} from 'src/carts/guards/cart-identity.guard';
import { CurrentCart } from 'src/carts/decorators/current-cart.decorator';
import { StoreOrdersService } from './store-orders.service';
import { FastifyReply } from 'fastify';

@UseGuards(OptionalJwtAuthGuard, CartIdentityGuard)
@Controller('store/orders')
export class StoreOrdersController {
  constructor(private storeOrdersService: StoreOrdersService) {}

  @Post('')
  placeOrder(
    @CurrentCart() cart: CartIdentity,
    @Body() body: CreateOrderDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    return this.storeOrdersService.placeOrder(cart, body, res);
  }
}
