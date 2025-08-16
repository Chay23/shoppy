import { Module } from '@nestjs/common';
import { AdminProductsService } from './admin/admin-products.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminProductsController } from './admin/admin-products.controller';
import { ProductsRepository } from './products.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AdminProductsController],
  providers: [AdminProductsService, ProductsRepository],
})
export class ProductsModule {}
