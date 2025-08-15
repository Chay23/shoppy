import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminCategoriesService } from './admin-categories.service';
import { AdminOnly } from 'src/auth/decorators/admin-only.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateCategoryDto } from './dtos/create-category.dto';
import {
  Pagination,
  PaginationParams,
} from 'src/common/decorators/pagination-params.decorator';
import { SearchParam } from 'src/common/decorators/search-param.decorator';
import { Id } from 'src/common/decorators/id-param.decorator';

@AdminOnly()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/categories')
export class AdminCategoriesController {
  constructor(private adminCategoriesService: AdminCategoriesService) {}
  @Post('')
  createCategory(@Body() body: CreateCategoryDto) {
    return this.adminCategoriesService.create(body);
  }

  @Get('')
  getCategories(
    @PaginationParams() pagination: Pagination,
    @SearchParam() query: string,
  ) {
    return this.adminCategoriesService.list(pagination, query);
  }

  @Get(':id')
  getCategory(@Id(ParseIntPipe) id: number) {
    return this.adminCategoriesService.sigle(id);
  }

  @Delete(':id')
  deleteCategory(@Id(ParseIntPipe) id: number) {
    return this.adminCategoriesService.deleteSingle(id);
  }
}
