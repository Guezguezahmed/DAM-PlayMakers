// src/schemas/equipe.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { StatsEquipe, StatsEquipeSchema } from './stats-equipe.schema';
import { User } from './user.schemas'; // Assuming User is in src/schemas/user.schemas

export type EquipeDocument = Equipe & mongoose.Document;

export enum Categorie {
    MINIM = 'MINIM',
    CADET = 'CADET',
    SENIOR = 'SENIOR',
}

export enum Genre {
    MASCULIN = 'MASCULIN',
    FEMININ = 'FEMININ',
    MIXTE = 'MIXTE',
}

@Schema({ timestamps: true })
export class Equipe {
  @Prop({ required: true, unique: true })
  nom: string;

  // List of players (User IDs)
  @Prop({ 
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  members: mongoose.Schema.Types.ObjectId[];

  @Prop({ required: true, enum: Categorie })
  categorie: Categorie;

  @Prop({ required: true, enum: Genre })
  genre: Genre;

  // Embedded sub-document for statistics
  @Prop({ type: StatsEquipeSchema, default: {} })
  stats: StatsEquipe;
}

export const EquipeSchema = SchemaFactory.createForClass(Equipe);