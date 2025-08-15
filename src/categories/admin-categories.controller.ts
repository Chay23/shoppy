import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AdminOnly } from 'src/auth/decorators/admin-only.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Controller('admin/categories')
export class AdminCategoriesController {
  constructor(private categoriesService: CategoriesService) {}
  @Post('')
  @AdminOnly()
  @UseGuards(JwtAuthGuard, RolesGuard)
  createCategory(@Body() body: CreateCategoryDto) {
    return this.categoriesService.create(body);
  }

}
