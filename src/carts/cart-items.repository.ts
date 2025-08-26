import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartItemsRepository {
  constructor(private prismaService: PrismaService) {}

  upsert(args: Prisma.CartItemUpsertArgs) {
    return this.prismaService.cartItem.upsert(args);
  }

  update(args: Prisma.CartItemUpdateArgs) {
    return this.prismaService.cartItem.update(args);
  }

  delete(args: Prisma.CartItemDeleteArgs) {
    return this.prismaService.cartItem.delete(args);
  }
}
