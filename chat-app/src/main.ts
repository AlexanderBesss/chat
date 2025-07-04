import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV, validateEnv } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(ENV.app_port);
}
validateEnv();
bootstrap();
