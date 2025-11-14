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
    // Utiliser GOOGLE_CALLBACK_URL si défini, sinon construire depuis BACKEND_URL
    const backendUrl = configService.get<string>('BACKEND_URL') || 'http://localhost:3001';
    // Nettoyer l'URL : supprimer les espaces, les guillemets, les slashes finaux, et les caractères étranges
    const cleanBackendUrl = backendUrl
      .trim()                                    // Supprimer les espaces avant/après
      .replace(/^["']|["']$/g, '')              // Supprimer les guillemets au début/fin
      .replace(/\/+$/, '')                       // Supprimer les slashes finaux (un ou plusieurs)
      .replace(/[=]+$/, '')                      // Supprimer les = à la fin (comme ==)
      .replace(/\s+/g, '');                      // Supprimer tous les espaces
    const defaultCallbackURL = `${cleanBackendUrl}/api/v1/auth/google/redirect`;
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL') || defaultCallbackURL;

    // Log pour déboguer l'URL de callback
    console.log('🔧 [GOOGLE_STRATEGY] Configuration OAuth Google:');
    console.log(`   → BACKEND_URL: ${backendUrl}`);
    console.log(`   → URL nettoyée: ${cleanBackendUrl}`);
    console.log(`   → GOOGLE_CALLBACK_URL: ${configService.get<string>('GOOGLE_CALLBACK_URL') || 'Non défini (utilisation de la valeur par défaut)'}`);
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
        return done(new UnauthorizedException('Google profile information is incomplete'), null);
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
        return done(new UnauthorizedException('Email is required from Google OAuth'), null);
      }

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
        return done(new UnauthorizedException('Failed to create or find user'), null);
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
}
