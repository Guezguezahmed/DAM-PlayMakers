// src/schemas/stats-equipe.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false }) // Use _id: false to prevent Mongoose from creating an extra ID field
export class StatsEquipe {
  @Prop({ default: 0 })
  nbrMatchJoue: number;

  @Prop({ default: 0 })
  matchWin: number;

  @Prop({ default: 0 })
  matchDraw: number;

  @Prop({ default: 0 })
  matchLoose: number;

  @Prop({ default: 0 })
  nbrButMarques: number;

  @Prop({ default: 0 })
  nbrButEncaisse: number;
}

export const StatsEquipeSchema = SchemaFactory.createForClass(StatsEquipe);