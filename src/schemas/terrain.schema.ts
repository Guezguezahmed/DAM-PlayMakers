import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Terrain {
  // Reference to the Academy owner (e.g., the User/OWNER entity ID)
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  id_academie: mongoose.Schema.Types.ObjectId; 

  // The physical location/address of the terrain
  @Prop({ required: true })
  localisation: string;
}

export const TerrainSchema = SchemaFactory.createForClass(Terrain);