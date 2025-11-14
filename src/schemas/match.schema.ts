// src/schemas/match.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export enum Statut {
    PROGRAMME = 'PROGRAMME',
    EN_COURS = 'EN_COURS',
    TERMINE = 'TERMINE',
}

@Schema({ timestamps: true }) 
export class Match {
  
  // References
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Terrain', required: true })
  id_terrain: mongoose.Schema.Types.ObjectId; 

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Equipe', required: true })
  id_equipe1: mongoose.Schema.Types.ObjectId; 

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Equipe', required: true })
  id_equipe2: mongoose.Schema.Types.ObjectId; 

  // Referee (Arbitre is a User role)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  id_arbitre: mongoose.Schema.Types.ObjectId; 

  // Details
  @Prop({ required: true })
  date: Date;
  
  // Scores (Optional initially, required when match is TERMINE)
  @Prop({ default: 0 })
  score_eq1: number;
  
  @Prop({ default: 0 })
  score_eq2: number;

  @Prop({ required: true, enum: Statut, default: Statut.PROGRAMME })
  statut: Statut;
}

export const MatchSchema = SchemaFactory.createForClass(Match);