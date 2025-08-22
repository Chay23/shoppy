import { Module } from '@nestjs/common';
import { AdminProductsService } from './admin/admin-products.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminProductsController } from './admin/admin-products.controller';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';
import { StoreProductsController } from './store/store-products.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AdminProductsController, StoreProductsController],
  providers: [AdminProductsService, ProductsRepository, ProductsService],
})
export class ProductsModule {}
