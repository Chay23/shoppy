import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'generated/prisma';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @UseGuards(LocalAuthGuard)
  signin(@CurrentUser() user: User) {
    return user;
  }
}
