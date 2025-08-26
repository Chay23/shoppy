import {
  Body,
  Controller,
  Delete,
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
import { OptionalJwtAuthGuard } from 'src/auth/guards/optiona-jwt-auth.guard';

@Controller('store/carts/items')
@UseGuards(OptionalJwtAuthGuard, CartIdentityGuard)
export class StoreCartItemsController {
  constructor(private storeCartItemsService: StoreCartItemsService) {}

  @Post('')
  addItem(@CurrentCart() cart: CartIdentity, @Body() body: AddItemDto) {
    return this.storeCartItemsService.addItem(cart, body);
  }

  @Delete('')
  deleteAllItems(@CurrentCart() cart: CartIdentity) {
    return this.storeCartItemsService.deleteAllItems(cart);
  }

  @Patch(':id')
  updateItemQuantity(
    @CurrentCart() cart: CartIdentity,
    @Id(ParseIntPipe) id: number,
    @Body() body: UpdateItemDto,
  ) {
    return this.storeCartItemsService.updateItemQuantity(cart, id, body);
  }

  @Delete(':id')
  deleteItem(@CurrentCart() cart: CartIdentity, @Id(ParseIntPipe) id: number) {
    return this.storeCartItemsService.deleteItem(cart, id);
  }
}
