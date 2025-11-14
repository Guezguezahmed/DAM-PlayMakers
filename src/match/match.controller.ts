// src/match/match.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { Roles } from 'src/auth/decorators/role.decorators';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Statut } from 'src/schemas/match.schema';

@ApiTags('Matches')
@ApiBearerAuth('access-token')
@Controller('matches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  // POST /matches: Only OWNER can schedule a match
  @Post()
  @Roles('OWNER')
  @ApiOperation({ summary: 'Créer/programmer un nouveau match (OWNER uniquement)' })
  @ApiResponse({ status: 201, description: 'Match créé avec succès.' })
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.create(createMatchDto);
  }

  // GET /matches: All roles can view the schedule
  @Get()
  @Roles('JOUEUR', 'OWNER', 'ARBITRE')
  @ApiOperation({ summary: 'Afficher la liste de tous les matchs' })
  @ApiResponse({ status: 200, description: 'Liste des matchs récupérée.' })
  findAll() {
    return this.matchService.findAll();
  }

  // GET /matches/:id
  @Get(':id')
  @Roles('JOUEUR', 'OWNER', 'ARBITRE')
  @ApiOperation({ summary: 'Afficher les détails d’un match par ID' })
  @ApiParam({ name: 'id', description: 'ID du match' })
  findOne(@Param('id') id: string) {
    return this.matchService.findOne(id);
  }

  // PATCH /matches/:id: Restricted to OWNER (for rescheduling) and ARBITRE (for status/score updates)
  @Patch(':id')
  @Roles('OWNER', 'ARBITRE')
  @ApiOperation({ summary: 'Modifier un match (OWNER pour les détails, ARBITRE pour le statut/score)' })
  async update(
    @Param('id') id: string,
    @Body() updateMatchDto: UpdateMatchDto,
    @Req() req: any,
  ) {
    const match = await this.matchService.findOne(id);
    const userId = req.user.userId;
    const userRole = req.user.role;

    if (!match) {
        throw new NotFoundException(`Match with ID ${id} not found.`);
    }

    // ARBITRE can only update score and status, and only for the match they are assigned to
    if (userRole === 'ARBITRE') {
        if (match.id_arbitre.toString() !== userId) {
            throw new ForbiddenException("En tant qu'Arbitre, vous ne pouvez modifier que le statut et le score des matchs qui vous sont assignés.");
        }
        
        // Prevent Arbitre from changing other fields
        const allowedArbitreUpdates = [
            'score_eq1', 'score_eq2', 'statut'
        ];
        
        for (const key of Object.keys(updateMatchDto)) {
            if (!allowedArbitreUpdates.includes(key)) {
                throw new ForbiddenException(`L'arbitre n'est autorisé à modifier que le statut et les scores.`);
            }
        }
    }

    // OWNER can update everything, no further checks needed for them here.

    return this.matchService.update(id, updateMatchDto);
  }

  // DELETE /matches/:id: Only OWNER can delete
  @Delete(':id')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Supprimer un match (OWNER uniquement)' })
  @ApiResponse({ status: 200, description: 'Match supprimé avec succès.' })
  remove(@Param('id') id: string) {
    return this.matchService.remove(id);
  }
}