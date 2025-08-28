import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShippingInfosRepository {
  constructor(private prismaService: PrismaService) {}

  create(args: Prisma.ShippingInfoCreateArgs) {
    return this.prismaService.shippingInfo.create(args);
  }
}
