import { Controller, Get } from '@nestjs/common';
import { ProductsService } from '../products.service';
import {
  Pagination,
  PaginationParams,
} from 'src/common/decorators/pagination-params.decorator';
import { SearchParam } from 'src/common/decorators/search-param.decorator';
import { StoreProductsService } from './store-products.service';
import { Slug } from 'src/common/decorators/slug-param.decorator';
import {
  Sorting,
  SortingParams,
} from 'src/common/decorators/sorting-params.decorator';
import { Product } from 'generated/prisma';

@Controller('store/products')
export class StoreProductsController {
  constructor(
    private productsService: ProductsService,
    private storeProductsService: StoreProductsService,
  ) {}

  @Get('')
  getProducts(
    @PaginationParams() pagination: Pagination,
    @SortingParams(['price', 'stock'] as Array<keyof Product>)
    sort: Sorting,
    @SearchParam() query: string,
  ) {
    return this.productsService.findAll(pagination, sort, query);
  }

  @Get(':slug')
  getProduct(@Slug() slug: string) {
    return this.storeProductsService.findOnyBySlug(slug);
  }
}
