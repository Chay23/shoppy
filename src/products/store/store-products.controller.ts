import { Controller, Get, Query } from '@nestjs/common';
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
import { ProductCategoryParam } from 'src/common/decorators/product-category-param.decorator';
import { ProductsFiltersDto } from './dtos/products-filters.dto';

@Controller('store/products')
export class StoreProductsController {
  constructor(private storeProductsService: StoreProductsService) {}

  @Get('')
  getProducts(
    @PaginationParams() pagination: Pagination,
    @SortingParams(['price', 'stock'] as Array<keyof Product>) sort: Sorting,
    @Query() queryParams: ProductsFiltersDto,
    @ProductCategoryParam() categorySlug?: string,
    @SearchParam() searchQuery?: string,
  ) {
    return this.storeProductsService.findAll({
      pagination,
      sort,
      queryParams,
      searchQuery,
      categorySlug,
    });
  }

  @Get(':slug')
  getProduct(@Slug() slug: string) {
    return this.storeProductsService.findOnyBySlug(slug);
  }
}
