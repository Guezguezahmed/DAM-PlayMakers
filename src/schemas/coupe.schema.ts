// src/schemas/coupe.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export enum CoupeStatut {
    PROGRAMME = 'PROGRAMME',
    EN_COURS = 'EN_COURS',
    TERMINE = 'TERMINE',
}

@Schema({ timestamps: true }) 
export class Coupe {
  
  @Prop({ required: true })
  nom: string;
  
  // Organizer (User with OWNER role)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  id_organisateur: mongoose.Schema.Types.ObjectId; 

  // Participating teams
  @Prop({ 
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipe' }],
    default: [],
  })
  participants: mongoose.Schema.Types.ObjectId[];
  
  // Match history (will be populated from the Match module)
  // We can choose not to store it here, but reference is useful for navigation.
  @Prop({ 
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match' }],
    default: [],
  })
  matches: mongoose.Schema.Types.ObjectId[];

  @Prop({ required: true })
  date_debut: Date;
  
  @Prop({ required: true })
  date_fin: Date;
  
  @Prop({ required: true, enum: CoupeStatut, default: CoupeStatut.PROGRAMME })
  statut: CoupeStatut;
  
  // Winner (only set if statut is TERMINE)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Equipe', required: false })
  id_vainqueur?: mongoose.Schema.Types.ObjectId; 
}

export const CoupeSchema = SchemaFactory.createForClass(Coupe);
