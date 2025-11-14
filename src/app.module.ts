import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ✅ Import du module de config
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [
    // ✅ Charge automatiquement ton fichier .env et rend les variables accessibles via process.env
    ConfigModule.forRoot({ isGlobal: true }),

    // ✅ Connexion à MongoDB
    MongooseModule.forRoot('mongodb://localhost:27017/dam_backend'),

    // ✅ Modules de ton projet
    UsersModule,
    AuthModule,
    OtpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
