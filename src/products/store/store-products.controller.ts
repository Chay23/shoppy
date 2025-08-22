import { Controller, Get, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from '../products.service';
import {
  Pagination,
  PaginationParams,
} from 'src/common/decorators/pagination-params.decorator';
import { SearchParam } from 'src/common/decorators/search-param.decorator';
import { Id } from 'src/common/decorators/id-param.decorator';

@Controller('store/products')
export class StoreProductsController {
  constructor(private productsService: ProductsService) {}
  @Get('')
  getProducts(
    @PaginationParams() pagination: Pagination,
    @SearchParam() query: string,
  ) {
    return this.productsService.findAll(pagination, query);
  }

  @Get(':id')
  getProduct(@Id(ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }
}
