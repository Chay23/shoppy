import { Body, Controller, Get, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AdminOnly } from 'src/auth/decorators/admin-only.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { PaginationParams } from 'src/common/decorators/pagination-params.decorator';
import { SearchParam } from 'src/common/decorators/search-param.decorator';
import { Id } from 'src/common/decorators/id-param.decorator';

@Controller('admin/categories')
export class AdminCategoriesController {
  constructor(private categoriesService: CategoriesService) {}
  @Post('')
  @AdminOnly()
  @UseGuards(JwtAuthGuard, RolesGuard)
  createCategory(@Body() body: CreateCategoryDto) {
    return this.categoriesService.create(body);
  }

  @Get('')
  @AdminOnly()
  @UseGuards(JwtAuthGuard, RolesGuard)
  getCategories(@PaginationParams() pagination, @SearchParam() query) {
    return this.categoriesService.adminList(pagination, query);
  }

  @Get(':id')
  @AdminOnly()
  @UseGuards(JwtAuthGuard, RolesGuard)
  getCategory(@Id(ParseIntPipe) id: number) {
    return this.categoriesService.adminSigle(id);
  }
}
