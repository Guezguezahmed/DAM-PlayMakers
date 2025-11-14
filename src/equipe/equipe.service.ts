import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose'; // <-- ADDED: Necessary for using Mongoose types (like ObjectId)
import { Equipe } from 'src/schemas/equipe.schema';
import { CreateEquipeDto } from './dto/create-equipe.dto';
import { UpdateEquipeDto, UpdateTeamMembersDto } from './dto/update-equipe.dto';

@Injectable()
export class EquipeService {
  constructor(@InjectModel(Equipe.name) private equipeModel: Model<Equipe>) {}

  // **C**REATE
  async create(createEquipeDto: CreateEquipeDto): Promise<Equipe> {
    const newEquipe = new this.equipeModel(createEquipeDto);
    return newEquipe.save();
  }

  // **R**EAD All
  findAll(): Promise<Equipe[]> {
    return this.equipeModel
      .find()
      .populate('members', 'nom prenom') // Populate member names
      .exec();
  }
  
  // **R**EAD One
  findOne(id: string): Promise<Equipe | null> {
    return this.equipeModel.findById(id).populate('members', 'nom prenom').exec();
  }

  // **U**PDATE (General)
  update(id: string, updateEquipeDto: UpdateEquipeDto): Promise<Equipe | null> {
    return this.equipeModel
      .findByIdAndUpdate(id, updateEquipeDto, {
        new: true,
        runValidators: true,
      })
      .populate('members', 'nom prenom')
      .exec();
  }

  // **U**PDATE (Add Member)
  async addMember(teamId: string, { playerId }: UpdateTeamMembersDto): Promise<Equipe> {
    const equipe = await this.equipeModel.findById(teamId).exec();
    if (!equipe) {
      throw new NotFoundException(`Équipe with ID ${teamId} not found.`);
    }

    if (equipe.members.map(id => id.toString()).includes(playerId)) {
      throw new BadRequestException('Le joueur est déjà dans cette équipe.');
    }

    // FIX: Using 'as any' to bypass the specific TypeScript/Mongoose type conflict (Error 2345).
    // Mongoose handles the conversion from string ID to ObjectId internally during save.
    equipe.members.push(playerId as any); 
    
    return equipe.save();
  }
  
  // **U**PDATE (Remove Member)
  async removeMember(teamId: string, { playerId }: UpdateTeamMembersDto): Promise<Equipe> {
    const equipe = await this.equipeModel.findById(teamId).exec();
    if (!equipe) {
      throw new NotFoundException(`Équipe with ID ${teamId} not found.`);
    }

    const initialLength = equipe.members.length;
    
    // Remove the player ID from the array using filter
    // We cast to string for comparison and then back to the expected type for the array.
    equipe.members = equipe.members.filter(id => id.toString() !== playerId) as mongoose.Schema.Types.ObjectId[];

    if (equipe.members.length === initialLength) {
        throw new NotFoundException('Le joueur n\'est pas membre de cette équipe.');
    }

    return equipe.save();
  }

  // **D**ELETE
  remove(id: string): Promise<any> {
    return this.equipeModel.findByIdAndDelete(id).exec();
  }
}