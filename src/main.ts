import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';
import fastifyCookie from '@fastify/cookie';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './util';
import { fastifyInstance } from './util/fastify-instance.util';
import { ConfigService } from '@nestjs/config';
import { NODE_ENV } from './app/constants';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  const configService = app.get(ConfigService);
  const PORT = +configService.get<number>('PORT');
  
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();

  if(configService.get<string>('NODE_ENV') === NODE_ENV.DEVELOPMENT) {
    setupSwagger(app);
  }
  fastifyInstance(app);

  await app.register(fastifyCookie);
  await app.listen(PORT);
}
bootstrap();
