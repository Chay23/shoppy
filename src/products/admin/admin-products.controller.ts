import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminOnly } from 'src/auth/decorators/admin-only.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateProductDto } from './dtos/create-product.dto';
import { AdminProductsService } from './admin-products.service';
import { FastifyRequest } from 'fastify';
import { extname, join } from 'path';
import { Id } from 'src/common/decorators/id-param.decorator';
import { FilesUploadInterceptor } from 'src/common/interceptors/files/files-upload.interceptor';
import { UploadedFiles } from 'src/common/decorators/uploaded-files.decorator';
import { MultipartFile } from '@fastify/multipart';
import { UploadedFile } from 'src/common/decorators/uploaded-file.decorator';
import { UpdateProductDto } from './dtos/update-product.dto';
import {
  Pagination,
  PaginationParams,
} from 'src/common/decorators/pagination-params.decorator';
import { SearchParam } from 'src/common/decorators/search-param.decorator';

@AdminOnly()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/products')
export class AdminProductsController {
  constructor(private adminProductService: AdminProductsService) {}
  @Post('')
  createProduct(@Body() body: CreateProductDto) {
    return this.adminProductService.create(body);
  }

  @Post(':id/main-image')
  @UseInterceptors(
    new FilesUploadInterceptor({
      uploadPath: join(
        __dirname,
        '..',
        '..',
        '..',
        'public',
        'uploads',
        'products',
      ),
      filename: (
        fileName: string,
        req: FastifyRequest<{ Params: { id: number } }>,
      ) => {
        return `${req.params.id}_${Date.now()}${extname(fileName)}`;
      },
      maxSize: 1 * 1024 * 1024,
      allowedTypes: ['image/jpeg'],
    }),
  )
  async uploadProductMainImage(
    @Id(ParseIntPipe) id: number,
    @UploadedFile() file: MultipartFile,
  ) {
    return this.adminProductService.updateMainImage(id, file);
  }

  @Post(':id/images')
  @UseInterceptors(
    new FilesUploadInterceptor({
      uploadPath: join(
        __dirname,
        '..',
        '..',
        '..',
        'public',
        'uploads',
        'products',
      ),
      filename: (
        fileName: string,
        req: FastifyRequest<{ Params: { id: number } }>,
      ) => {
        return `${req.params.id}_${Date.now()}${extname(fileName)}`;
      },
      maxSize: 1 * 1024 * 1024,
      allowedTypes: ['image/jpeg'],
    }),
  )
  async uploadProductImages(
    @Id(ParseIntPipe) id: number,
    @UploadedFiles() files: MultipartFile[],
  ) {
    return this.adminProductService.updateImages(id, files);
  }

  @Get('')
  getProducts(
    @PaginationParams() pagination: Pagination,
    @SearchParam() query: string,
  ) {
    return this.adminProductService.findAll(pagination, query);
  }

  @Patch(':id')
  updateProduct(@Id(ParseIntPipe) id: number, @Body() body: UpdateProductDto) {
    return this.adminProductService.update(id, body);
  }
}
