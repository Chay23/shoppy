import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ShippingInfosService } from './shipping-infos.service';
import { ShippingInfosRepository } from './shipping-infos.repository';

@Module({
  imports: [PrismaModule],
  exports: [ShippingInfosService],
  providers: [ShippingInfosService, ShippingInfosRepository],
})
export class ShippingInfosModule {}
