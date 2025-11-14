import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Optional: prefix global
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Projet DAM API')
    .setDescription('API pour l’application DAM')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token', // nom du security scheme
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // -> http://localhost:3000/api

  await app.listen(3000);
}
bootstrap();
