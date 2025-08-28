import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersRepository {
  constructor(private prismaService: PrismaService) {}

  create(args: Prisma.OrderCreateArgs) {
    return this.prismaService.order.create(args);
  }
}
