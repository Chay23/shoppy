import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '../../generated/prisma/runtime/library';
import { Prisma, User } from 'generated/prisma';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateUserDto) {
    try {
      return await this.prismaService.user.create({
        data: {
          ...data,
          password: await bcrypt.hash(data.password, 10),
          role: data?.role || 'CUSTOMER',
        },
      });
    } catch (err) {
      if ((err as PrismaClientKnownRequestError).code === 'P2002') {
        throw new UnprocessableEntityException('Email is already in use');
      }
      throw err;
    }
  }

  async update(params: Prisma.UserUpdateArgs) {
    return this.prismaService.user.update(params);
  }

  async getUnique(filter: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUniqueOrThrow({
      where: filter,
    });
  }
}
