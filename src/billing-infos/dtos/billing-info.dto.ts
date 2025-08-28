import { IsString, MaxLength } from 'class-validator';

export class BillingInfoDto {
  @IsString()
  @MaxLength(255)
  fullName: string;

  @IsString()
  @MaxLength(255)
  address: string;

  @IsString()
  @MaxLength(255)
  city: string;

  @IsString()
  @MaxLength(255)
  country: string;

  @IsString()
  @MaxLength(255)
  zipCode: string;
}
