import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config'; // ✅ Import ConfigService
import configuration from './config/configuration'; // ✅ Import the configuration file
import { MessagesModule } from './messages/messages.module';
import { TerrainModule } from './terrain/terrain.module';
import { EquipeModule } from './equipe/equipe.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ChatEquipeModule } from './chat-equipe/chat-equipe.module';
import { MatchModule } from './match/match.module';
import { CoupeModule } from './coupe/coupe.module';
import { OtpModule } from './otp/otp.module';
import { GoogleApiModule } from './google-api/google-api.module';

@Module({
  imports: [
    // 1. ConfigModule setup: Load .env and the configuration file globally
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration], // ✅ Load the new configuration file
    }),

    // 2. MongooseModule: Use ConfigService to get the connection URI
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // Use the key defined in configuration.ts
        uri: configService.get<string>('mongoUri'), 
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    AuthModule,
    OtpModule,
    GoogleApiModule,
    MessagesModule,
    TerrainModule,
    EquipeModule,
    NotificationsModule,
    ChatEquipeModule,
    MatchModule,
    CoupeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}