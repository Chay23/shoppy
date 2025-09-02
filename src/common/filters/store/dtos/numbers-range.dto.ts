import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  Validate,
  ValidateNested,
} from 'class-validator';
import { IsRangeOrderValid } from '../validators/range-order.validator';

const RangeValue = () =>
  applyDecorators(
    IsOptional(),
    Type(() => Number),
    IsNumber(),
  );

export class NumbersRange {
  @RangeValue()
  gte: number;

  @RangeValue()
  gt: number;

  @RangeValue()
  lte: number;

  @RangeValue()
  lt: number;
}

export const NumbersRangeProp = () =>
  applyDecorators(
    Validate(IsRangeOrderValid),
    ValidateNested(),
    Type(() => NumbersRange),
  );
