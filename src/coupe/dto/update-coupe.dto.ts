// src/coupe/dto/update-coupe.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateCoupeDto } from './create-coupe.dto';
import { IsOptional, IsEnum, IsMongoId, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CoupeStatut } from 'src/schemas/coupe.schema';

// General update DTO
export class UpdateCoupeDto extends PartialType(CreateCoupeDto) {
  @ApiPropertyOptional({ enum: CoupeStatut, example: CoupeStatut.EN_COURS, description: 'Statut de la compétition' })
  @IsEnum(CoupeStatut)
  @IsOptional()
  statut?: CoupeStatut;
  
  @ApiPropertyOptional({ example: '60c72b2f9b1e8b0015b3c3c1', description: 'ID de l’équipe déclarée vainqueur' })
  @IsMongoId()
  @IsOptional()
  id_vainqueur?: string;
}

// DTO for adding/removing a single participant
export class UpdateCoupeParticipantsDto {
    @ApiPropertyOptional({ 
        example: '60c72b2f9b1e8b0015b3c3c9', 
        description: 'ID de l’équipe à ajouter ou retirer',
    })
    @IsMongoId()
    @IsString()
    teamId: string;
}