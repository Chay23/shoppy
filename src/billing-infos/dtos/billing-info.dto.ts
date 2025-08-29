import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class BillingInfoDto {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @MaxLength(255)
  address: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  city: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  country: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  zipCode: string;
}
