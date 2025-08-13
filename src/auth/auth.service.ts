import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma';
import { FastifyReply } from 'fastify';
import { ConfigService } from '@nestjs/config';
import ms, { StringValue } from 'ms';
import { TokenPayload } from 'src/types/token-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
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

  async login(user: User, response: FastifyReply) {
    const expires = new Date();
    expires.setMilliseconds(
      expires.getMilliseconds() +
        ms(
          this.configService.getOrThrow<string>(
            'JWT_EXPIRATION',
          ) as StringValue,
        ),
    );

    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    const token = this.jwtService.sign(tokenPayload);

    response.setCookie('Authentication', token, {
      httpOnly: true,
      secure: true,
      expires,
    });

    return { tokenPayload };
  }
}
