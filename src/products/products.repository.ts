import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsRepository {
  constructor(private prismaService: PrismaService) {}

  create(args: Prisma.ProductCreateArgs) {
    return this.prismaService.product.create(args);
  }

  findAll(args?: Prisma.ProductFindManyArgs) {
    return this.prismaService.product.findMany(args);
  }

  count(args?: Prisma.ProductCountArgs) {
    return this.prismaService.product.count(args);
  }

  findOne(args: Prisma.ProductFindUniqueOrThrowArgs) {
    return this.prismaService.product.findUniqueOrThrow(args);
  }

  update(args: Prisma.ProductUpdateArgs) {
    return this.prismaService.product.update(args);
  }

  deleteOne(args: Prisma.ProductDeleteArgs) {
    return this.prismaService.product.delete(args);
  }
}
