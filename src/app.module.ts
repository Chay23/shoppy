import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { CartsModule } from './carts/carts.module';
import { ShippingInfosModule } from './shipping-infos/shipping-infos.module';
import { BillingInfosModule } from './billing-infos/billing-infos.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, AuthModule, CategoriesModule, ProductsModule, CartsModule, ShippingInfosModule, BillingInfosModule],
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
  ],
})
export class AppModule {}
