import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../../auth/auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    // Try to get from config first (using configuration.ts structure)
    let clientID = configService.get<string>('google.clientId');
    let clientSecret = configService.get<string>('google.clientSecret');
    let callbackURL = configService.get<string>('google.callbackUrl');

    // Fallback to direct env variables if config doesn't have them
    if (!clientID || clientID === 'NO_GOOGLE_CLIENT_ID') {
      clientID = configService.get<string>('GOOGLE_CLIENT_ID') || '';
    }
    if (!clientSecret || clientSecret === 'NO_GOOGLE_CLIENT_SECRET') {
      clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET') || '';
    }

    // Build callback URL from BACKEND_URL if not set
    if (!callbackURL || callbackURL === 'http://localhost:3000/auth/google/callback') {
      const backendUrl = configService.get<string>('BACKEND_URL') || 'http://localhost:3000';
      // Clean the URL: remove spaces, quotes, trailing slashes, and strange characters
      const cleanBackendUrl = backendUrl
        .trim()                                    // Remove spaces before/after
        .replace(/^["']|["']$/g, '')              // Remove quotes at start/end
        .replace(/\/+$/, '')                       // Remove trailing slashes (one or more)
        .replace(/[=]+$/, '')                      // Remove = at the end (like ==)
        .replace(/\s+/g, '');                      // Remove all spaces
      const defaultCallbackURL = `${cleanBackendUrl}/api/v1/auth/google/redirect`;
      callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL') || defaultCallbackURL;
    }

    // Log for debugging callback URL
    console.log('🔧 [GOOGLE_STRATEGY] Configuration OAuth Google:');
    console.log(`   → BACKEND_URL: ${configService.get<string>('BACKEND_URL') || 'Not set'}`);
    console.log(`   → GOOGLE_CALLBACK_URL: ${configService.get<string>('GOOGLE_CALLBACK_URL') || 'Not set (using default)'}`);
    console.log(`   → Callback URL utilisée: ${callbackURL}`);
    console.log(`   → ⚠️ Assurez-vous que cette URL est EXACTEMENT la même dans Google Cloud Console`);

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
        return done(new UnauthorizedException('Google profile information is incomplete'), undefined);
      }

      const email = profile.emails[0].value;
      const givenName = profile.name?.givenName;
      const familyName = profile.name?.familyName;
      const displayName = profile.displayName;
      const picture = profile.photos?.[0]?.value || profile._json?.picture;

      console.log('📧 [GOOGLE_OAUTH] Données récupérées depuis Google:');
      console.log(`   → Email: ${email}`);
      console.log(`   → Prénom: ${givenName}`);
      console.log(`   → Nom: ${familyName}`);
      console.log(`   → Nom complet: ${displayName}`);
      console.log(`   → Photo: ${picture ? 'Oui' : 'Non'}`);

      if (!email) {
        return done(new UnauthorizedException('Email is required from Google OAuth'), undefined);
      }

      // Use the enhanced OAuth user handling method
      const user = await this.authService.findOrCreateOAuthUser({
        provider: 'google',
        providerId: profile.id,
        email,
        givenName,
        familyName,
        displayName,
        picture,
      });

      if (!user) {
        return done(new UnauthorizedException('Failed to create or find user'), undefined);
      }

      return done(null, user);
    } catch (err) {
      return done(err, undefined);
    }
  }
}

