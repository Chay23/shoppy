import { Validate } from 'class-validator';
import {
  NumbersRange,
  NumbersRangeProp,
} from 'src/common/filters/store/dtos/numbers-range.dto';
import { IsPositiveRange } from 'src/common/filters/store/validators/positive-range.validator';

export class ProductsFiltersDto {
  @NumbersRangeProp()
  @Validate(IsPositiveRange)
  price: NumbersRange;
}
