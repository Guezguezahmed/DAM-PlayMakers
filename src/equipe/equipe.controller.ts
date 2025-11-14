// src/equipe/equipe.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EquipeService } from './equipe.service';
import { CreateEquipeDto } from './dto/create-equipe.dto';
import { UpdateEquipeDto, UpdateTeamMembersDto } from './dto/update-equipe.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { Roles } from 'src/auth/decorators/role.decorators';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Equipes')
@ApiBearerAuth('access-token')
@Controller('equipes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EquipeController {
  constructor(private readonly equipeService: EquipeService) {}

  // POST /equipes: Only OWNER can create teams
  @Post()
  @Roles('OWNER')
  @ApiOperation({ summary: 'Créer une nouvelle équipe (OWNER uniquement)' })
  @ApiResponse({ status: 201, description: 'Équipe créée avec succès.' })
  create(@Body() createEquipeDto: CreateEquipeDto) {
    return this.equipeService.create(createEquipeDto);
  }

  // GET /equipes: All roles can view teams
  @Get()
  @Roles('JOUEUR', 'OWNER', 'ARBITRE')
  @ApiOperation({ summary: 'Afficher la liste de toutes les équipes' })
  @ApiResponse({ status: 200, description: 'Liste des équipes récupérée.' })
  findAll() {
    return this.equipeService.findAll();
  }

  // GET /equipes/:id
  @Get(':id')
  @Roles('JOUEUR', 'OWNER', 'ARBITRE')
  @ApiOperation({ summary: 'Afficher les détails d’une équipe par ID' })
  @ApiParam({ name: 'id', description: 'ID de l’équipe' })
  @ApiResponse({ status: 200, description: 'Équipe trouvée.' })
  findOne(@Param('id') id: string) {
    return this.equipeService.findOne(id);
  }

  // PATCH /equipes/:id: Only OWNER can modify general team info
  @Patch(':id')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Modifier les informations générales d’une équipe (OWNER uniquement)' })
  @ApiResponse({ status: 200, description: 'Équipe modifiée avec succès.' })
  update(@Param('id') id: string, @Body() updateEquipeDto: UpdateEquipeDto) {
    return this.equipeService.update(id, updateEquipeDto);
  }

  // PATCH /equipes/add-member/:id: Only OWNER can add players
  @Patch('add-member/:id')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Ajouter un joueur à l’équipe (OWNER uniquement)' })
  @ApiBody({ type: UpdateTeamMembersDto, description: 'ID du joueur à ajouter' })
  addMember(@Param('id') id: string, @Body() updateMembersDto: UpdateTeamMembersDto) {
    return this.equipeService.addMember(id, updateMembersDto);
  }

  // PATCH /equipes/remove-member/:id: Only OWNER can remove players
  @Patch('remove-member/:id')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Retirer un joueur de l’équipe (OWNER uniquement)' })
  @ApiBody({ type: UpdateTeamMembersDto, description: 'ID du joueur à retirer' })
  removeMember(@Param('id') id: string, @Body() updateMembersDto: UpdateTeamMembersDto) {
    return this.equipeService.removeMember(id, updateMembersDto);
  }

  // DELETE /equipes/:id: Only OWNER can delete a team
  @Delete(':id')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Supprimer une équipe (OWNER uniquement)' })
  @ApiResponse({ status: 200, description: 'Équipe supprimée avec succès.' })
  remove(@Param('id') id: string) {
    return this.equipeService.remove(id);
  }
}