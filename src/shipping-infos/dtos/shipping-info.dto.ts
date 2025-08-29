import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ShippingInfoDto {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
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
