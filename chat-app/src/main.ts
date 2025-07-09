import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV, validateEnv } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  console.log('Starting app om port: ', ENV.APP_PORT);
  await app.listen(ENV.APP_PORT, '0.0.0.0');
}
validateEnv();
bootstrap();
