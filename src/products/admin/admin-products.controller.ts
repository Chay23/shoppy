import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminOnly } from 'src/auth/decorators/admin-only.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateProductDto } from './dtos/create-product.dto';
import { AdminProductsService } from './admin-products.service';

@AdminOnly()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/products')
export class AdminProductsController {
  constructor(private adminProductService: AdminProductsService) {}
  @Post('')
  createProduct(@Body() body: CreateProductDto) {
    return this.adminProductService.create(body);
  }
}
