// src/equipe/dto/update-equipe.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipeDto } from './create-equipe.dto';
import { IsString, IsOptional, IsMongoId, IsArray, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEquipeDto extends PartialType(CreateEquipeDto) {
    // We explicitly define fields that might be modified separately from the base DTO.
    @ApiPropertyOptional({ example: 'Nouveau Nom', description: 'Nouveau nom de l’équipe' })
    @IsString()
    @IsOptional()
    nom?: string;

    // Use a separate DTO for handling stats updates, if necessary, but usually updated by match results.
}

// DTO for adding/removing a single player
export class UpdateTeamMembersDto {
    @ApiPropertyOptional({ 
        example: '60c72b2f9b1e8b0015b3c3c9', 
        description: 'ID du joueur à ajouter ou retirer',
    })
    @IsMongoId()
    @IsNotEmpty()
    playerId: string;
}