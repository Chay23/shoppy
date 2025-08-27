import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartsRepository {
  constructor(private prismaService: PrismaService) {}

  create(args: Prisma.CartCreateArgs) {
    return this.prismaService.cart.create(args);
  }

  findAll(args?: Prisma.CartFindManyArgs) {
    return this.prismaService.cart.findMany(args);
  }

  findOne(args: Prisma.CartFindUniqueArgs) {
    return this.prismaService.cart.findUnique(args);
  }

  count(args?: Prisma.CartCountArgs) {
    return this.prismaService.cart.count(args);
  }

  delete(args: Prisma.CartDeleteArgs) {
    return this.prismaService.cart.delete(args);
  }
}
