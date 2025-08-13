import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../../types/token-payload.interface';
import { FastifyRequest } from 'fastify';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: FastifyRequest) =>
          request.cookies.Authentication as string | null,
      ]),
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }
  validate(payload: TokenPayload) {
    return payload;
  }
}
