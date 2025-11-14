import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  prenom: string;

  @Prop({ required: true })
  nom: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  age: Date;

  @Prop({ required: true })
  tel: number;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: ['JOUEUR', 'OWNER', 'ARBITRE'],
    default: 'JOUEUR',
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
