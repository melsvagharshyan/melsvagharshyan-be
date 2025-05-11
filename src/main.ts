import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    express.json({ limit: '50mb' }), // Adjust as needed
    express.urlencoded({ limit: '50mb', extended: true }),
  );

  app.enableCors({
    origin: ['https://www.melsvagharshyan.com', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, // if you use cookies or authorization headers
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
