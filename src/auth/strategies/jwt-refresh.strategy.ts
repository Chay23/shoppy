import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../../types/token-payload.interface';
import { FastifyRequest } from 'fastify';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { REFRESH_COOKIE } from 'src/common/constants/cookies';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: FastifyRequest) =>
          request.cookies[REFRESH_COOKIE] as string | null,
      ]),
      secretOrKey: configService.getOrThrow('jwt-refresh.secret'),
      passReqToCallback: true,
    });
  }

  async validate(req: FastifyRequest, payload: TokenPayload) {
    const refreshToken = req.cookies.Refresh;
    if (!refreshToken) {
      throw new UnauthorizedException(REFRESH_TOKEN_MISSING);
    }
    const user = await this.usersService.getUnique({ id: payload.userId });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException(REFRESH_TOKEN_NOT_FOUND);
    }

    const tokenMatched = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!tokenMatched) {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN);
    }
    return user;
  }
}
