// src/equipe/equipe.module.ts
import { Module } from '@nestjs/common';
import { EquipeService } from './equipe.service';
import { EquipeController } from './equipe.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Equipe, EquipeSchema } from 'src/schemas/equipe.schema'; // Correct absolute path

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Equipe.name, schema: EquipeSchema }]),
  ],
  controllers: [EquipeController],
  providers: [EquipeService],
  exports: [EquipeService],
})
export class EquipeModule {}