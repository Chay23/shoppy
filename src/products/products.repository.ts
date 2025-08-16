import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsRepository {
  constructor(private prismaService: PrismaService) {}

  create(args: Prisma.ProductCreateArgs) {
    return this.prismaService.product.create(args);
  }
}
