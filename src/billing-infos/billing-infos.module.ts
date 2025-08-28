import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BillingInfosService } from './billing-infos.service';
import { BillingInfosRepository } from './billing-infos.repository';

@Module({
  imports: [PrismaModule],
  exports: [BillingInfosService],
  providers: [BillingInfosService, BillingInfosRepository],
})
export class BillingInfosModule {}
