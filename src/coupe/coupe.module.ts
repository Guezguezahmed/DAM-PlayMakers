// src/coupe/coupe.module.ts
import { Module } from '@nestjs/common';
import { CoupeService } from './coupe.service';
import { CoupeController } from './coupe.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupe, CoupeSchema } from 'src/schemas/coupe.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coupe.name, schema: CoupeSchema }]),
  ],
  controllers: [CoupeController],
  providers: [CoupeService],
})
export class CoupeModule {}