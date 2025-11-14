import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from '../google-api/guards/google-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // === Enregistrement ===
  @Post('register')
  @ApiOperation({
    summary: 'Inscription utilisateur',
    description: 'Crée un nouvel utilisateur dans la base de données',
  })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé avec succès.',
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur de validation ou utilisateur déjà existant.',
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  // === Connexion Locale ===
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Connexion utilisateur',
    description:
      'Authentifie un utilisateur et retourne un token JWT à utiliser pour les routes protégées.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'wassimd@test.com',
        },
        password: {
          type: 'string',
          example: '123456',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie. Retourne un token JWT.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Email ou mot de passe incorrect.',
  })
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    return this.authService.login(user);
  }
  
  // === Connexion Google: 1. Initialisation ===
  @Get('google')
  @ApiOperation({ 
    summary: 'Démarrer l\'authentification Google OAuth',
    description: `
      **Route d'initialisation de l'authentification Google OAuth2.**
      
      **⚠️ IMPORTANT:** Cette route doit être appelée depuis un navigateur web, pas via Swagger UI.
      
      **Comment utiliser:**
      1. Copiez l'URL complète: \`http://localhost:3001/api/v1/auth/google\`
      2. Ouvrez-la directement dans votre navigateur
      3. Vous serez redirigé vers la page de connexion Google
      4. Après authentification, Google vous redirigera vers \`/auth/google/redirect\`
      
      **Configuration requise:**
      - \`GOOGLE_CLIENT_ID\` et \`GOOGLE_CLIENT_SECRET\` doivent être configurés dans les variables d'environnement
      - L'URL de callback doit être configurée dans Google Cloud Console
    `,
    tags: ['Google OAuth'],
  })
  @ApiResponse({ 
    status: 302, 
    description: 'Redirection vers la page de connexion Google',
    headers: {
      Location: {
        description: 'URL de redirection vers Google OAuth',
        schema: { type: 'string', example: 'https://accounts.google.com/o/oauth2/v2/auth?...' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Google OAuth2 n\'est pas configuré. Vérifiez GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET dans votre .env'
  })
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Cette méthode ne sera pas exécutée car GoogleAuthGuard initie la redirection
  }

  // === Connexion Google: 2. Callback ===
  @Get('google/redirect')
  @ApiOperation({ 
    summary: 'Callback Google OAuth (Génère le JWT)',
    description: `
      **Route de callback pour l'authentification Google OAuth2.**
      
      **⚠️ NE PAS APPELER DIRECTEMENT:** Cette route est appelée automatiquement par Google après l'authentification.
      
      **Flux d'authentification:**
      1. L'utilisateur est redirigé vers Google pour se connecter
      2. Google authentifie l'utilisateur et redirige vers cette route
      3. Le système crée ou trouve l'utilisateur dans la base de données
      4. Un token JWT est généré
      5. L'utilisateur est redirigé vers le frontend avec le token dans l'URL
      
      **Réponse:**
      - Redirection vers: \`{FRONTEND_URL}/auth/success?token={JWT_TOKEN}&role={USER_ROLE}\`
      
      **Note:** Si l'utilisateur n'existe pas, il sera automatiquement créé avec les informations de son compte Google.
    `,
    tags: ['Google OAuth'],
  })
  @ApiResponse({ 
    status: 302, 
    description: 'Redirection vers le frontend avec le token JWT dans les paramètres d\'URL',
    headers: {
      Location: {
        description: 'URL de redirection vers le frontend avec token',
        schema: { 
          type: 'string', 
          example: 'http://localhost:4200/auth/success?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...&role=JOUEUR' 
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Échec de l\'authentification Google',
    schema: {
      example: {
        statusCode: 401,
        message: 'Google authentication failed'
      }
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Erreur lors de la création ou de la récupération de l\'utilisateur'
  })
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    if (!req.user) {
      throw new UnauthorizedException('Google authentication failed');
    }

    // req.user is already the full user object from GoogleStrategy.validate()
    // Use the login method to generate JWT token
    const loginResult = await this.authService.login(req.user);
    const token = loginResult.access_token;

    // Get frontend URL from environment or use default
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const redirectUrl = `${frontendUrl.replace(/\/$/, '')}/auth/success?token=${token}&role=${req.user.role}`;

    // Note: Utiliser res.redirect() nécessite l'injection de @Res() et l'utilisation du paramètre natif Express/Fastify.
    return res.redirect(redirectUrl);
  }
}