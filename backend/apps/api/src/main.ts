import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ApiModule } from './api.module';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  const httpAdapter = app.get(HttpAdapterHost);

  app.use(helmet());
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('AI-SalesBoost API')
    .setDescription('API endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.API_PORT || process.env.PORT || 8088;
  await app.listen(port);
}
bootstrap();
