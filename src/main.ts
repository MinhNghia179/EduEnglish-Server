import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/LoggingInterceptor';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Global exception filters
  app.useGlobalFilters();

  // Global authentication and authorization
  app.useGlobalGuards();

  // Global validation pipes
  app.useGlobalPipes(new ValidationPipe());

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global interceptors for response and request
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();
