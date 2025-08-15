import { Controller, Get } from "@nestjs/common";
import { StoreCategoriesService } from "./store-categories.service";
import { Pagination, PaginationParams } from "src/common/decorators/pagination-params.decorator";
import { SearchParam } from "src/common/decorators/search-param.decorator";
import { Id } from "src/common/decorators/id-param.decorator";


@Controller('store/categories')
export class StoreCategoriesController {
    constructor(private storeCategoriesService: StoreCategoriesService) {}

    @Get('')
    getCategories(@PaginationParams() pagination: Pagination, @SearchParam() query: string) {
        return this.storeCategoriesService.list(pagination, query);
    }

    @Get(':id')
    getCategory(@Id() id: number) { 
        return this.storeCategoriesService.single(id);
    }
}