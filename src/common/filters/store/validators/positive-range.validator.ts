import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { NumbersRange } from '../dtos/numbers-range.dto';

@ValidatorConstraint({ name: 'isRangeOrderValid', async: false })
export class IsPositiveRange implements ValidatorConstraintInterface {
  validate(range: NumbersRange): Promise<boolean> | boolean {
    if (!range) {
      return true;
    }

    for (const value of Object.values(range) as (number | undefined)[]) {
      if (value && value <= 0) {
        return false;
      }
    }
    return true;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Invalid range params: "${validationArguments?.property}", all values must be positive`;
  }
}
