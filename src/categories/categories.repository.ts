import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class CategoriesRepository {
  constructor(private prismaService: PrismaService) {}

  create(args: Prisma.CategoryCreateArgs) {
    return this.prismaService.category.create(args);
  }

  findAll(args?: Prisma.CategoryFindManyArgs) {
    return this.prismaService.category.findMany(args);
  }

  findOne(args: Prisma.CategoryFindUniqueOrThrowArgs) {
    return this.prismaService.category.findUniqueOrThrow(args);
  }

  count(args?: Prisma.CategoryCountArgs) {
    return this.prismaService.category.count(args);
  }
}
