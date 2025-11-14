// src/equipe/dto/create-equipe.dto.ts
import { IsString, IsNotEmpty, IsEnum, IsArray, IsMongoId, ArrayMinSize, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Categorie, Genre } from 'src/schemas/equipe.schema';

export class CreateEquipeDto {
  @ApiProperty({ example: 'Les Foudres du Nord', description: 'Nom unique de l’équipe' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  // Members can be optionally added during creation, or added later
  @ApiPropertyOptional({ 
    example: ['60c72b2f9b1e8b0015b3c3c7', '60c72b2f9b1e8b0015b3c3c8'], 
    description: 'Liste des IDs des joueurs (Users) membres de l’équipe',
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  members?: string[];

  @ApiProperty({ example: Categorie.SENIOR, enum: Categorie, description: 'Catégorie de l’équipe' })
  @IsEnum(Categorie)
  @IsNotEmpty()
  categorie: Categorie;

  @ApiProperty({ example: Genre.MASCULIN, enum: Genre, description: 'Genre de l’équipe' })
  @IsEnum(Genre)
  @IsNotEmpty()
  genre: Genre;
}