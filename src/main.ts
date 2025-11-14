import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Préfixe global pour versionner ton API
  app.setGlobalPrefix('api/v1');

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Projet DAM API')
    .setDescription('API pour l’application DAM (OTP, Auth, Users, etc.)')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI accessible sur http://localhost:3000/api

  await app.listen(3000);
}
bootstrap();
