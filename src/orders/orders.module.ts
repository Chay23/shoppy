import { Module } from '@nestjs/common';
import { CartsModule } from 'src/carts/carts.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StoreOrdersController } from './store/store-orders.controller';
import { StoreOrdersService } from './store/store-orders.service';
import { OrdersRepository } from './orders.repository';
import { ShippingInfosModule } from 'src/shipping-infos/shipping-infos.module';
import { BillingInfosModule } from 'src/billing-infos/billing-infos.module';

@Module({
  imports: [PrismaModule, CartsModule, ShippingInfosModule, BillingInfosModule],
  controllers: [StoreOrdersController],
  providers: [StoreOrdersService, OrdersRepository],
})
export class OrdersModule {}
