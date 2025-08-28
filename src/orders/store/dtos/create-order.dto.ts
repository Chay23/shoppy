import { IsEmail, MaxLength, ValidateNested } from 'class-validator';
import { BillingInfoDto } from '../../../billing-infos/dtos/billing-info.dto';
import { ShippingInfoDto } from '../../../shipping-infos/dtos/shipping-info.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ValidateNested()
  @Type(() => ShippingInfoDto)
  shippingInfo: ShippingInfoDto;

  @ValidateNested()
  @Type(() => BillingInfoDto)
  billingInfo: BillingInfoDto;
}
