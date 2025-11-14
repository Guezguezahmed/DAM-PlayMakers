import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { Roles } from 'src/auth/decorators/role.decorators';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // Seul OWNER peut créer un utilisateur
  @Post()
  @Roles('OWNER')
  @ApiOperation({ summary: 'Créer un nouvel utilisateur (OWNER uniquement)' })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès.' })
  @ApiResponse({ status: 403, description: 'Accès refusé : seuls les OWNER peuvent créer un utilisateur.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // OWNER et ARBITRE peuvent consulter tous les utilisateurs
  @Get()
  @Roles('OWNER', 'ARBITRE')
  @ApiOperation({ summary: 'Afficher la liste des utilisateurs (OWNER et ARBITRE uniquement)' })
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs récupérée avec succès.' })
  findAll() {
    return this.usersService.findAll();
  }

  // JOUEUR, OWNER, et ARBITRE peuvent consulter un utilisateur par ID
  @Get(':id')
  @Roles('JOUEUR', 'OWNER', 'ARBITRE')
  @ApiOperation({ summary: 'Afficher les détails d’un utilisateur' })
  @ApiParam({ name: 'id', description: 'ID de l’utilisateur à consulter' })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé.' })
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  // seul le user connecter peut modifier son compte
  @Patch(':id')
  @Roles('JOUEUR', 'OWNER', 'ARBITRE')
  @ApiOperation({ summary: 'Modifier son propre compte' })
  @ApiParam({ name: 'id', description: 'ID de ton propre compte utilisateur' })
  @ApiResponse({ status: 200, description: 'Compte modifié avec succès.' })
  @ApiResponse({ status: 403, description: 'Tu ne peux modifier que ton propre compte.' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any, // 👉 on met "any" ici pour éviter l'erreur TypeScript
  ) {
    const user = req.user; // Injecté par JwtStrategy

    if (!user || user.userId !== id) {
      throw new ForbiddenException("Tu ne peux modifier que ton propre compte");
    }

    return this.usersService.update(id, updateUserDto);
  }

  // Seul OWNER peut supprimer un utilisateur
  @Delete(':id')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Supprimer un utilisateur (OWNER uniquement)' })
  @ApiParam({ name: 'id', description: 'ID de l’utilisateur à supprimer' })
  @ApiResponse({ status: 200, description: 'Utilisateur supprimé avec succès.' })
  @ApiResponse({ status: 403, description: 'Accès refusé : seuls les OWNER peuvent supprimer un utilisateur.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
