import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    forwardRef(() => AuthModule), // Use forwardRef to avoid circular dependency
  ],
  providers: [
    GoogleStrategy,
    GoogleAuthGuard,
  ],
  exports: [
    GoogleStrategy,
    GoogleAuthGuard,
  ],
})
export class GoogleApiModule {}

