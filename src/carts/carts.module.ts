import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { StoreCartsController } from './store/store-carts.controller';
import { StoreCartsService } from './store/store-carts.service';
import { CartsRepository } from './carts.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsModule } from 'src/products/products.module';
import { CartItemsRepository } from './cart-items.repository';
import { StoreCartItemsController } from './store/store-cart-items.controller';
import { StoreCartItemsService } from './store/store-cart-items.service';

@Module({
  exports: [StoreCartsService],
  imports: [PrismaModule, ProductsModule],
  providers: [
    CartsService,
    StoreCartsService,
    StoreCartItemsService,
    CartsRepository,
    CartItemsRepository,
  ],
  controllers: [StoreCartsController, StoreCartItemsController],
})
export class CartsModule {}
