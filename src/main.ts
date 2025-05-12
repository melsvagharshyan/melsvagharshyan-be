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
    origin: [
      'https://www.melsvagharshyan.com',
      'https://melsvagharshyan-admin-fe.vercel.app',
      'https://site--melsvagharshyan-be--69z8m7t7vlwy.code.run',
      'https://melsvagharshyan-be.sliplane.app',
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true, // if you use cookies or authorization headers
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
