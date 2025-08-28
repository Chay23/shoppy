import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BillingInfosRepository {
  constructor(private prismaService: PrismaService) {}
  create(args: Prisma.BillingInfoCreateArgs) {
    return this.prismaService.billingInfo.create(args);
  }
}
