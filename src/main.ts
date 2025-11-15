import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Préfixe global pour toutes les routes
  app.setGlobalPrefix('api/v1');

  // Activer CORS pour le développement.
  // En dev, autoriser l'origine frontend définie dans les variables d'environnement
  // ou autoriser toutes les origines si non défini. Restrict for production.
  const frontendOrigin = process.env.FRONTEND_URL || '*';
  app.enableCors({
    origin: frontendOrigin === '*' ? true : frontendOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Projet DAM API')
    .setDescription("API pour l'application DAM")
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // -> Swagger disponible sur /api

  // Port dynamique pour Render / environnement local
  // NOTE: configuration.ts uses backendUrl default http://localhost:3001
  // so default to 3001 to match that expectation. You can still override with PORT env var.
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}

bootstrap();
