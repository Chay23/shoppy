import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { AdminCategoriesController } from './admin-categories.controller';
import { CategoriesRepository } from './categories.repository';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [AdminCategoriesController],
  providers: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
