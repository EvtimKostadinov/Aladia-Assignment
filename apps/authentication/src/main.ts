import { NestFactory } from '@nestjs/core';
import { AuthenticationModule } from './authentication.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthenticationModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('AUTH_PORT'),
    },
  });

  await app.startAllMicroservices();
}
bootstrap();
