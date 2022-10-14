import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const hostDomain = AppModule.isDev
    ? `${AppModule.host}:${AppModule.port}`
    : AppModule.host;

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Nest MEAN')
    .setDescription('API Documentation')
    .setVersion('1.0.0')
    .addServer(AppModule.isDev ? 'http' : 'https')
    .addBearerAuth(
      {
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        scheme: 'Bearer',
        type: 'http', // I`ve attempted type: 'apiKey' too
        in: 'Header',
      },
      'header',
    )
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerOptions, { ignoreGlobalPrefix: true});

  SwaggerModule.setup('/api/docs', app, swaggerDoc, {
    swaggerUrl: `${hostDomain}/api/docs-json`,
    explorer: true,
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });

  // app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(AppModule.port);
}
bootstrap();
