import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseEnvelopeInterceptor } from './common/interceptors/response-envelope.interceptor';

function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Composable API')
    .setDescription(
      `## Composable Backend API

A production-ready authentication system with JWT-based auth, role-based access control, and email verification.

### Features
- 🔐 JWT Authentication (Access + Refresh tokens)
- 👤 User Registration with Email Verification (OTP)
- 🛡️ Role-Based Access Control (USER, ADMIN)
- 📧 Email Service with OTP delivery
- 🔒 Secure password hashing (bcrypt)

### Authentication
Use the **Authorize** button to set your JWT access token for protected endpoints.
Format: \`Bearer <your-access-token>\`
    `,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'User authentication and authorization endpoints')
    .addTag('Admin', 'Admin-only endpoints for user management')
    .build();

  const document = SwaggerModule.createDocument(app as any, config);
  SwaggerModule.setup('api/docs', app as any, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Composable API Documentation',
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Security headers
  app.use(helmet());

  // Global prefix for API versioning
  app.setGlobalPrefix('api/v1', { exclude: ['health', 'health/ready'] });

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global response envelope
  app.useGlobalInterceptors(new ResponseEnvelopeInterceptor());

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS — strict in production, permissive in development
  const frontendUrl = process.env.FRONTEND_URL;
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && !frontendUrl) {
    logger.error('FRONTEND_URL must be set in production. Exiting.');
    process.exit(1);
  }

  app.enableCors({
    origin: frontendUrl || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Swagger (only in non-production)
  if (!isProduction) {
    setupSwagger(app);
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 Application running on http://localhost:${port}`);
  if (!isProduction) {
    logger.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
  }

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.log(`${signal} received — shutting down gracefully…`);
    await app.close();
    process.exit(0);
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}
void bootstrap();
