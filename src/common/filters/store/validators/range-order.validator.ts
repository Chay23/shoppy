import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isRangeOrderValid', async: false })
export class IsRangeOrderValid implements ValidatorConstraintInterface {
  validate(range: any): Promise<boolean> | boolean {
    if (!range) {
      return true;
    }

    const { gte, lte, gt, lt } = range;

    return (
      (gte === undefined || lte === undefined || gte <= lte) &&
      (gt === undefined || lte === undefined || gt < lte) &&
      (gte === undefined || lt === undefined || gte < lt) &&
      (gt === undefined || lt === undefined || gt < lt)
    );
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    'left side is more than right side';
    return `Invalid range params: "${validationArguments?.property}", lower limit should not exceed upper limit`;
  }
}
