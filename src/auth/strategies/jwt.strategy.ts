import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../../common/interfaces/auth.interface';
import { FastifyRequest } from 'fastify';
import { AUTHENTICATION_COOKIE } from 'src/common/constants/cookies';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: FastifyRequest) =>
          request.cookies[AUTHENTICATION_COOKIE] as string | null,
      ]),
      secretOrKey: configService.getOrThrow('jwt.secret'),
    });
  }
  validate(payload: TokenPayload) {
    return payload;
  }
}
