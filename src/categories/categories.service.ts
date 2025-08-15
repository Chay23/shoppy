import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import slugify from 'slugify';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateCategoryDto) {
    try {
      const slug =
        data.slug ||
        slugify(data.name, {
          lower: true,
        });
      return await this.prismaService.category.create({
        data: {
          ...data,
          slug,
        },
        select: {
          name: true,
          slug: true,
        },
      });
    } catch (err) {
      if (((err as PrismaClientKnownRequestError).code = 'P2002')) {
        throw new UnprocessableEntityException('Slug already in use');
      }
    }
  }
}
