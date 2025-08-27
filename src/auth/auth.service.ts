import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ConfigService, ConfigType } from '@nestjs/config';
import ms, { StringValue } from 'ms';
import { TokenPayload } from 'src/common/interfaces/auth.interface';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from './config/jwt-refresh.config';
import {
  AUTHENTICATION_COOKIE,
  CART_TOKEN_COOKIE,
  REFRESH_COOKIE,
} from 'src/common/constants/cookies';
import { StoreCartsService } from 'src/carts/store/store-carts.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly storeCartsService: StoreCartsService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersService.getUnique({ email });
      const authenticated = await bcrypt.compare(password, user.password);
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch {
      throw new UnauthorizedException('Credentials are not valid');
    }
  }

  private getCookieExpiration(configKey: string) {
    const expires = new Date();
    expires.setMilliseconds(
      expires.getMilliseconds() +
        ms(this.configService.getOrThrow(configKey) as StringValue),
    );

    return expires;
  }

  async signin(user: User, request: FastifyRequest, response: FastifyReply) {
    const tokenPayload: TokenPayload = {
      userId: user.id,
      role: user.role,
    };

    const { accessToken, refreshToken } = await this.getJwtTokens(tokenPayload);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update({
      where: { id: user.id },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });

    const guestCartToken = request.cookies[CART_TOKEN_COOKIE];

    if (guestCartToken) {
      await this.storeCartsService.mergeGuestCartIntoUser(guestCartToken, user.id);
      response.clearCookie(CART_TOKEN_COOKIE, { path: '/' });
    }

    response.setCookie(AUTHENTICATION_COOKIE, accessToken, {
      httpOnly: true,
      secure: true,
      expires: this.getCookieExpiration('jwt.signOptions.expiresIn'),
      path: '/',
    });

    response.setCookie(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: true,
      expires: this.getCookieExpiration('jwt-refresh.expiresIn'),
      path: '/',
    });

    return { tokenPayload };
  }

  async getJwtTokens(payload: TokenPayload) {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.jwtService.signAsync(
      payload,
      this.refreshTokenConfig,
    );

    return { accessToken, refreshToken };
  }
}
