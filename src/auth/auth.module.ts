import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import refreshJwtConfig from './config/jwt-refresh.config';
import jwtConfig from './config/jwt.config';
import { RefreshJwtStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, RefreshJwtStrategy],
})
export class AuthModule {}
