import {
  Body,
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
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { TokenPayload } from 'src/common/interfaces/auth.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
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

  @Post('signup')
  signup(
    @Body() body: CreateUserDto,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    return this.authService.signup(body, req, res);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser() user: TokenPayload,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    return this.authService.logout(user, res);
  }
}
