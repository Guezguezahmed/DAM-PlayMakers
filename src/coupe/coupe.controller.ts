// src/coupe/coupe.controller.ts
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
import { CoupeService } from './coupe.service';
import { CreateCoupeDto } from './dto/create-coupe.dto';
import { UpdateCoupeDto, UpdateCoupeParticipantsDto } from './dto/update-coupe.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guards';
import { Roles } from 'src/auth/decorators/role.decorators';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Coupes')
@ApiBearerAuth('access-token')
@Controller('coupes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoupeController {
  constructor(private readonly coupeService: CoupeService) {}

  // POST /coupes: Only OWNER can create a tournament
  @Post()
  @Roles('OWNER')
  @ApiOperation({ summary: 'Créer une nouvelle compétition (OWNER uniquement)' })
  @ApiResponse({ status: 201, description: 'Compétition créée avec succès.' })
  async create(@Body() createCoupeDto: CreateCoupeDto, @Req() req: any) {
    const userId = req.user.userId;

    if (createCoupeDto.id_organisateur !== userId) {
        throw new ForbiddenException("Vous ne pouvez créer des coupes que pour votre propre compte organisateur.");
    }
    
    return this.coupeService.create(createCoupeDto);
  }

  // GET /coupes: All roles can view tournaments
  @Get()
  @Roles('JOUEUR', 'OWNER', 'ARBITRE')
  @ApiOperation({ summary: 'Afficher la liste de toutes les compétitions' })
  @ApiResponse({ status: 200, description: 'Liste des compétitions récupérée.' })
  findAll() {
    return this.coupeService.findAll();
  }

  // GET /coupes/:id
  @Get(':id')
  @Roles('JOUEUR', 'OWNER', 'ARBITRE')
  @ApiOperation({ summary: 'Afficher les détails d’une compétition par ID' })
  @ApiParam({ name: 'id', description: 'ID de la Coupe' })
  findOne(@Param('id') id: string) {
    return this.coupeService.findOne(id);
  }

  // PATCH /coupes/:id: Only the organizer (or another OWNER) can update general info
  @Patch(':id')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Modifier les informations générales de la compétition (OWNER organisateur uniquement)' })
  async update(@Param('id') id: string, @Body() updateCoupeDto: UpdateCoupeDto, @Req() req: any) {
    const coupe = await this.coupeService.findOne(id);
    const userId = req.user.userId;

    if (!coupe) {
        throw new NotFoundException(`Coupe with ID ${id} not found.`);
    }

    // Check if the user is the organizer
    if (coupe.id_organisateur.toString() !== userId) {
      throw new ForbiddenException("Vous ne pouvez modifier que les compétitions que vous organisez.");
    }

    return this.coupeService.update(id, updateCoupeDto);
  }

  // PATCH /coupes/add-participant/:id
  @Patch('add-participant/:id')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Ajouter une équipe à la compétition (OWNER organisateur uniquement)' })
  @ApiBody({ type: UpdateCoupeParticipantsDto, description: 'ID de l’équipe à ajouter' })
  async addParticipant(@Param('id') id: string, @Body() updateParticipantsDto: UpdateCoupeParticipantsDto, @Req() req: any) {
    const coupe = await this.coupeService.findOne(id);
    if (!coupe || coupe.id_organisateur.toString() !== req.user.userId) {
        throw new ForbiddenException("Vous ne pouvez modifier que les compétitions que vous organisez.");
    }
    return this.coupeService.addParticipant(id, updateParticipantsDto);
  }
  
  // PATCH /coupes/remove-participant/:id
  @Patch('remove-participant/:id')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Retirer une équipe de la compétition (OWNER organisateur uniquement)' })
  @ApiBody({ type: UpdateCoupeParticipantsDto, description: 'ID de l’équipe à retirer' })
  async removeParticipant(@Param('id') id: string, @Body() updateParticipantsDto: UpdateCoupeParticipantsDto, @Req() req: any) {
    const coupe = await this.coupeService.findOne(id);
    if (!coupe || coupe.id_organisateur.toString() !== req.user.userId) {
        throw new ForbiddenException("Vous ne pouvez modifier que les compétitions que vous organisez.");
    }
    return this.coupeService.removeParticipant(id, updateParticipantsDto);
  }

  // DELETE /coupes/:id: Only the organizer (or another OWNER) can delete
  @Delete(':id')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Supprimer une compétition (OWNER organisateur uniquement)' })
  @ApiResponse({ status: 200, description: 'Compétition supprimée avec succès.' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const coupe = await this.coupeService.findOne(id);
    if (!coupe || coupe.id_organisateur.toString() !== req.user.userId) {
        throw new ForbiddenException("Vous ne pouvez supprimer que les compétitions que vous organisez.");
    }
    return this.coupeService.remove(id);
  }
}