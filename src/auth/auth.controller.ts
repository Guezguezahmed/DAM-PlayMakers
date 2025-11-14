import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
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

  // REGISTER
  @Post('register')
  @ApiOperation({
    summary: 'Inscription utilisateur',
    description: 'Crée un nouvel utilisateur (isVerified=false). L’utilisateur doit ensuite valider son email.',
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

  // LOGIN
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Connexion utilisateur',
    description: 'Authentifie un utilisateur par email + mot de passe et retourne un token JWT.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'wassimd@test.com' },
        password: { type: 'string', example: '123456' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie. Retourne un JWT.',
    schema: {
      example: { access_token: 'eyJhbGciOi...jwt...' },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Email ou mot de passe incorrect, ou compte non vérifié.',
  })
  async login(@Body() loginDto: { email: string; password: string }) {
    try {
      const user = await this.authService.validateUser(loginDto.email, loginDto.password);
      if (!user) throw new UnauthorizedException('Email ou mot de passe incorrect');
      return this.authService.login(user);
    } catch (err) {
      // Propagate UnauthorizedException thrown from validateUser when account not verified
      throw err;
    }
  }

  // SEND CODE (only for existing user)
  @Post('send-code')
  @ApiOperation({
    summary: 'Envoyer un code de vérification',
    description: 'Génère un code et l’envoie par email si l’utilisateur existe déjà.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'abdelliwassim100@gmail.com' },
      },
      required: ['email'],
    },
  })
  @ApiResponse({ status: 201, description: 'Code envoyé avec succès' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @ApiResponse({ status: 500, description: 'Impossible d’envoyer l’email' })
  sendCode(@Body() body: { email: string }) {
    return this.authService.sendVerificationCode(body.email);
  }

  // VERIFY CODE
  @Post('verify-code')
  @ApiOperation({
    summary: 'Vérifier le code de vérification',
    description: 'Vérifie que le code est correct et non expiré; marque le compte comme vérifié.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'abdelliwassim100@gmail.com' },
        code: { type: 'string', example: '123456' },
      },
      required: ['email', 'code'],
    },
  })
  @ApiResponse({ status: 200, description: 'Compte vérifié avec succès' })
  @ApiResponse({ status: 401, description: 'Code incorrect ou expiré' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  verifyCode(@Body() body: { email: string; code: string }) {
    return this.authService.verifyCode(body.email, body.code);
  }
  @Post('forgot-password')
@ApiOperation({
  summary: 'Demande de réinitialisation de mot de passe',
  description: 'Envoie un code de réinitialisation au mail si l’utilisateur existe.',
})
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      email: { type: 'string', example: 'user@example.com' },
    },
    required: ['email'],
  },
})
@ApiResponse({ status: 200, description: 'Code envoyé par email si utilisateur existe' })
@ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
forgotPassword(@Body() body: { email: string }) {
  return this.authService.sendPasswordResetCode(body.email);
}

// -------------------------
// 2) Verify reset code step
// -------------------------
@Post('forgot-password/verify-code')
@ApiOperation({
  summary: 'Vérifier le code de réinitialisation',
  description: 'Vérifie que le code reçu par email est correct et non expiré.',
})
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      email: { type: 'string', example: 'user@example.com' },
      code: { type: 'string', example: '123456' },
    },
    required: ['email', 'code'],
  },
})
@ApiResponse({ status: 200, description: 'Code valide' })
@ApiResponse({ status: 401, description: 'Code incorrect ou expiré' })
verifyResetCode(@Body() body: { email: string; code: string }) {
  return this.authService.verifyPasswordResetCode(body.email, body.code);
}

// ---------------------------------
// 3) Reset password (final step)
// ---------------------------------
@Post('forgot-password/reset')
@ApiOperation({
  summary: 'Réinitialiser le mot de passe',
  description:
    "Remplace l'ancien mot de passe si le code est valide. Body: { email, code, newPassword, confirmPassword }",
})
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      email: { type: 'string', example: 'user@example.com' },
      code: { type: 'string', example: '123456' },
      newPassword: { type: 'string', example: 'NouveauMdp123' },
      confirmPassword: { type: 'string', example: 'NouveauMdp123' },
    },
    required: ['email', 'code', 'newPassword', 'confirmPassword'],
  },
})
@ApiResponse({ status: 200, description: 'Mot de passe réinitialisé avec succès' })
@ApiResponse({ status: 400, description: 'Mots de passe non identiques' })
@ApiResponse({ status: 401, description: 'Code incorrect ou expiré' })
@ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
async resetPassword(@Body() body: { email: string; code: string; newPassword: string; confirmPassword: string }) {
  const { email, code, newPassword, confirmPassword } = body;
  if (newPassword !== confirmPassword) throw new BadRequestException('Les mots de passe ne correspondent pas');

  return this.authService.resetPasswordWithCode(email, code, newPassword);
}
}
