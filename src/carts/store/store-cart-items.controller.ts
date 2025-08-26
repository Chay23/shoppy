import {
  Body,
  Controller,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartIdentity, CartIdentityGuard } from '../guards/cart-identity.guard';
import { AddItemDto } from './dtos/add-item.dto';
import { CurrentCart } from '../decorators/current-cart.decorator';
import { Id } from 'src/common/decorators/id-param.decorator';
import { UpdateItemDto } from './dtos/update-item.dto';
import { StoreCartItemsService } from './store-cart-items.service';

@Controller('store/carts/items')
@UseGuards(CartIdentityGuard)
export class StoreCartItemsController {
  constructor(private storeCartItemsService: StoreCartItemsService) {}

  @Post('')
  addItem(@CurrentCart() cart: CartIdentity, @Body() body: AddItemDto) {
    return this.storeCartItemsService.addItem(cart, body);
  }

  @Patch(':id')
  updateItemQuantity(
    @CurrentCart() cart: CartIdentity,
    @Id(ParseIntPipe) id: number,
    @Body() body: UpdateItemDto,
  ) {
    return this.storeCartItemsService.updateItemQuantity(cart, id, body);
  }
}
