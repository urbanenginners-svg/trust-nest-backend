import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

/**
 * Bootstrap the NestJS application
 * Configures global pipes, filters, and interceptors
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get ConfigService for accessing environment variables
  const configService = app.get(ConfigService);

  // Global prefix for all routes (e.g., /api/v1)
  app.setGlobalPrefix('api/v1');

  // Global validation pipe - validates all DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Convert primitive types automatically
      },
    }),
  );

  // Global exception filter - standardizes error responses
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global logging interceptor - logs all requests
  app.useGlobalInterceptors(new LoggingInterceptor());

  // CORS configuration - enable for frontend access
  app.enableCors({
    origin:
      configService.get('NODE_ENV') === 'production'
        ? ['https://yourdomain.com'] // Replace with your production domain
        : ['http://localhost:3000', 'http://localhost:5173'], // Common frontend dev ports
    credentials: true,
  });

  // Get port from environment or default to 3000
  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);
  console.log(`📚 Environment: ${configService.get('NODE_ENV')}`);
  console.log(`💾 Database: ${configService.get('DB_NAME')}`);
}

bootstrap();
