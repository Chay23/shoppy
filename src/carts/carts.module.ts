import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { StoreCartsController } from './store/store-carts.controller';
import { StoreCartsService } from './store/store-carts.service';
import { CartsRepository } from './carts.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsModule } from 'src/products/products.module';
import { CartItemsRepository } from './cart-items.repository';

@Module({
  imports: [PrismaModule, ProductsModule],
  providers: [CartsService, StoreCartsService, CartsRepository, CartItemsRepository],
  controllers: [StoreCartsController],
})
export class CartsModule {}
