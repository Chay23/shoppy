import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'generated/prisma';
import { FastifyReply } from 'fastify';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @UseGuards(LocalAuthGuard)
  signin(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    return this.authService.login(user, res);
  }
}
