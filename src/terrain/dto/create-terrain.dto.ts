import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTerrainDto {
  @ApiProperty({ example: '60c72b2f9b1e8b0015b3c3c7', description: 'ID de l’Académie propriétaire du terrain' })
  @IsString()
  @IsNotEmpty()
  @IsMongoId() 
  id_academie: string;

  @ApiProperty({ example: 'Rue de la Liberté, Tunis', description: 'Localisation physique du terrain' })
  @IsString()
  @IsNotEmpty()
  localisation: string;
}