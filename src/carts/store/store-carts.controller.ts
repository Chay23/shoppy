import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CartIdentity, CartIdentityGuard } from '../guards/cart-identity.guard';
import { AddItemDto } from './dtos/add-item.dto';
import { StoreCartsService } from './store-carts.service';
import { CurrentCart } from '../decorators/current-cart.decorator';

@Controller('store/carts')
@UseGuards(CartIdentityGuard)
export class StoreCartsController {
  constructor(private storeCartsService: StoreCartsService) {}

  @Post('items')
  addItem(@CurrentCart() cart: CartIdentity, @Body() body: AddItemDto) {
    return this.storeCartsService.addItem(cart, body);
  }
}
