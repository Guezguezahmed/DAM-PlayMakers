// src/coupe/coupe.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Coupe } from 'src/schemas/coupe.schema';
import { CreateCoupeDto } from './dto/create-coupe.dto';
import { UpdateCoupeDto, UpdateCoupeParticipantsDto } from './dto/update-coupe.dto';

@Injectable()
export class CoupeService {
  constructor(@InjectModel(Coupe.name) private coupeModel: Model<Coupe>) {}

  // **C**REATE
  async create(createCoupeDto: CreateCoupeDto): Promise<Coupe> {
    const newCoupe = new this.coupeModel(createCoupeDto);
    return newCoupe.save();
  }

  // **R**EAD All
  findAll(): Promise<Coupe[]> {
    return this.coupeModel
      .find()
      .populate('id_organisateur', 'nom prenom')
      .populate('participants', 'nom')
      .exec();
  }
  
  // **R**EAD One
  findOne(id: string): Promise<Coupe | null> {
    return this.coupeModel
      .findById(id)
      .populate('id_organisateur', 'nom prenom')
      .populate('participants', 'nom')
      .populate('id_vainqueur', 'nom')
      .exec();
  }

  // **U**PDATE (General)
  update(id: string, updateCoupeDto: UpdateCoupeDto): Promise<Coupe | null> {
    return this.coupeModel
      .findByIdAndUpdate(id, updateCoupeDto, {
        new: true,
        runValidators: true,
      })
      .exec();
  }

  // **U**PDATE (Add Participant)
  async addParticipant(coupeId: string, { teamId }: UpdateCoupeParticipantsDto): Promise<Coupe> {
    const coupe = await this.coupeModel.findById(coupeId).exec();
    if (!coupe) {
      throw new NotFoundException(`Coupe with ID ${coupeId} not found.`);
    }

    if (coupe.participants.map(id => id.toString()).includes(teamId)) {
      throw new BadRequestException('Cette équipe participe déjà à la Coupe.');
    }

    // Use 'as any' to handle TypeScript/Mongoose conflict when pushing string ID
    coupe.participants.push(teamId as any); 
    return coupe.save();
  }
  
  // **U**PDATE (Remove Participant)
  async removeParticipant(coupeId: string, { teamId }: UpdateCoupeParticipantsDto): Promise<Coupe> {
    const coupe = await this.coupeModel.findById(coupeId).exec();
    if (!coupe) {
      throw new NotFoundException(`Coupe with ID ${coupeId} not found.`);
    }

    const initialLength = coupe.participants.length;
    
    // Remove the team ID from the array
    coupe.participants = coupe.participants.filter(id => id.toString() !== teamId) as mongoose.Schema.Types.ObjectId[];

    if (coupe.participants.length === initialLength) {
        throw new NotFoundException('Cette équipe ne participe pas à la Coupe.');
    }

    return coupe.save();
  }

  // **D**ELETE
  remove(id: string): Promise<any> {
    return this.coupeModel.findByIdAndDelete(id).exec();
  }
}