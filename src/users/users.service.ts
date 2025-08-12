import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '../../generated/prisma/runtime/library';

@Injectable()
export class UsersService {
  constructor(private readonly prismaSerivce: PrismaService) {}

  async create(data: CreateUserDto) {
    try {
      return await this.prismaSerivce.user.create({
        data: {
          ...data,
          password: await bcrypt.hash(data.password, 10),
          role: data?.role || 'CUSTOMER',
        },
        select: {
          id: true,
          email: true,
        },
      });
    } catch (err) {
      if ((err as PrismaClientKnownRequestError).code === 'P2002') {
        throw new UnprocessableEntityException('Email is already in use');
      }
      throw err;
    }
  }
}
