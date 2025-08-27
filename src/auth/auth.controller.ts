import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'generated/prisma';
import { FastifyReply, FastifyRequest } from 'fastify';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { RefreshJwtGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @UseGuards(LocalAuthGuard)
  signin(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: FastifyReply,
    @Req() req: FastifyRequest,
  ) {
    return this.authService.signin(user, req, res);
  }

  @Post('refresh')
  @UseGuards(RefreshJwtGuard)
  async refreshJwt(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: FastifyReply,
    @Req() req: FastifyRequest,
  ) {
    return this.authService.signin(user, req, res);
  }
}
