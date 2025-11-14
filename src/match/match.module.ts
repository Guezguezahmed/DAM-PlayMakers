// src/match/match.module.ts
import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchSchema } from 'src/schemas/match.schema'; 
import { Equipe, EquipeSchema } from 'src/schemas/equipe.schema'; // Needed for stats update

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: Match.name, schema: MatchSchema },
        { name: Equipe.name, schema: EquipeSchema }, // Provide Equipe model for stats update
    ]),
  ],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}