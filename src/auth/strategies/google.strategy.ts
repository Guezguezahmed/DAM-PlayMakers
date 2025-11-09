import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID') || '';
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET') || '';
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL') || 'http://localhost:3002/api/v1/auth/google/redirect';

    // Don't throw error at startup, let the guard handle it
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    try {
      if (!profile || !profile.emails || !profile.emails[0]) {
        return done(new UnauthorizedException('Google profile information is incomplete'), null);
      }

      const email = profile.emails[0].value;
      const givenName = profile.name?.givenName;
      const familyName = profile.name?.familyName;

      if (!email) {
        return done(new UnauthorizedException('Email is required from Google OAuth'), null);
      }

      const user = await this.authService.findOrCreateOAuthUser({
        provider: 'google',
        providerId: profile.id,
        email,
        givenName,
        familyName,
        displayName: profile.displayName,
      });

      if (!user) {
        return done(new UnauthorizedException('Failed to create or find user'), null);
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
}
