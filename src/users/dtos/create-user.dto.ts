import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { UserRole } from 'generated/prisma';

export class CreateUserDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @MaxLength(60)
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsStrongPassword()
  @MaxLength(255)
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
