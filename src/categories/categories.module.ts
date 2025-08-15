import { Module } from '@nestjs/common';
import { AdminCategoriesService } from './admin-categories.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { AdminCategoriesController } from './admin-categories.controller';
import { CategoriesRepository } from './categories.repository';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [AdminCategoriesController],
  providers: [AdminCategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
