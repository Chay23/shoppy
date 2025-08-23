import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  stock?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  categoryId: number;
}
