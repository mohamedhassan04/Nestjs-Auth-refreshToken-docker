import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';

require('dotenv').config();
const port = process.env.PORT || 3000;

async function bootstrap() {
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(),
      { cors: true },
    );
  app.setGlobalPrefix('api');

  await app.listen(port);

  Logger.log(`Server is running on port ${port}`);
}
bootstrap();
