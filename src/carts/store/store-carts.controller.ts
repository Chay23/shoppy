import { Controller, UseGuards } from '@nestjs/common';
import { CartIdentityGuard } from '../guards/cart-identity.guard';
import { StoreCartsService } from './store-carts.service';

@Controller('store/carts')
@UseGuards(CartIdentityGuard)
export class StoreCartsController {
  constructor(private storeCartsService: StoreCartsService) {}
}
