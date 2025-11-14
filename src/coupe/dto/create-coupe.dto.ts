// src/coupe/dto/create-coupe.dto.ts
import { IsString, IsNotEmpty, IsMongoId, IsDate, IsArray, ArrayMinSize, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CoupeStatut } from 'src/schemas/coupe.schema';

export class CreateCoupeDto {
  @ApiProperty({ example: 'Coupe d\'Hiver 2025', description: 'Nom de la compétition' })
  @IsString()
  @IsNotEmpty()
  nom: string;
  
  @ApiProperty({ example: '60c72b2f9b1e8b0015b3c3c7', description: 'ID de l’utilisateur organisateur (OWNER)' })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  id_organisateur: string;
  
  @ApiPropertyOptional({ 
    example: ['60c72b2f9b1e8b0015b3c3c1', '60c72b2f9b1e8b0015b3c3c2'], 
    description: 'Liste des IDs des équipes participantes',
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  participants?: string[];

  @ApiProperty({ example: '2025-01-01T08:00:00Z', description: 'Date de début de la compétition' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date_debut: Date;

  @ApiProperty({ example: '2025-01-31T22:00:00Z', description: 'Date de fin prévue de la compétition' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date_fin: Date;
  
  @ApiPropertyOptional({ enum: CoupeStatut, default: CoupeStatut.PROGRAMME, description: 'Statut initial de la Coupe' })
  @IsEnum(CoupeStatut)
  @IsOptional()
  statut?: CoupeStatut;
}