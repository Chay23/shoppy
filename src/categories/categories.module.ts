import { Module } from '@nestjs/common';
import { AdminCategoriesService } from './admin/admin-categories.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { AdminCategoriesController } from './admin/admin-categories.controller';
import { CategoriesRepository } from './categories.repository';
import { StoreCategoriesService } from './store/store-categories.service';
import { StoreCategoriesController } from './store/store-categories.controller';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [AdminCategoriesController, StoreCategoriesController],
  providers: [
    AdminCategoriesService,
    StoreCategoriesService,
    CategoriesRepository,
  ],
})
export class CategoriesModule {}
