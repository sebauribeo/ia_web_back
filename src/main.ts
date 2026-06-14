/**
 * Punto de entrada de la aplicación AI Platform.
 * Configura y arranca el servidor NestJS con Swagger,
 * validación global, CORS y prefijo de rutas.
 */
process.env.TZ = 'America/Santiago';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: CORS_ORIGIN,
    credentials: true,
  });

  // Configuración de Swagger para documentación interactiva
  const config = new DocumentBuilder()
    .setTitle('AI Platform API')
    .setDescription('API for AI Platform services')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Backend running on http://localhost:${port}`);
  logger.log(`Swagger docs on http://localhost:${port}/api/docs`);
}
bootstrap();
