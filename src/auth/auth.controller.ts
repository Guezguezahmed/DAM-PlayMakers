import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
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

  // === Connexion ===
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
}
