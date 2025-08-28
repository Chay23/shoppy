import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.register(fastifyCookie, {
    secret: app.get(ConfigService).getOrThrow<string>('COOKIE_SECRET'),
  });
  app.register(fastifyMultipart);
  app.register(fastifyStatic, {
    root: join(__dirname, '..', 'public'),
    prefix: '/public/',
  });

  await app.listen({
    port: app.get(ConfigService).getOrThrow('PORT'),
    host: '0.0.0.0',
  });
}
bootstrap();
