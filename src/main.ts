import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Get environment variables
  const port = configService.get<number>('PORT', 3001);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const corsOriginLocal = configService.get<string>(
    'CORS_ORIGIN_LOCAL',
    'http://localhost:3000',
  );
  const corsOriginProduction = configService.get<string>(
    'CORS_ORIGIN_PRODUCTION',
    'https://your-frontend-domain.com',
  );

  const corsOrigin =
    nodeEnv === 'production' ? corsOriginProduction : corsOriginLocal;

  app.enableCors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Sales Microservice API')
    .setDescription('Microservice for managing vehicle sales operations')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  console.log(`🚀 Sales Microservice is running on port ${port}`);
  console.log(`🌐 CORS configured for: ${corsOrigin}`);
  console.log(
    `📚 API Documentation available at: http://localhost:${port}/api/docs`,
  );
}
bootstrap();
