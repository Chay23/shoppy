import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { AdminCategoriesController } from './admin-categories.controller';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [AdminCategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
