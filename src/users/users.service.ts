import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private usermodel: Model<User>) {}

  create(createUserDto: CreateUserDto) {
    const newUser = new this.usermodel(createUserDto);
    return newUser.save();
  }

  findAll() {
    return this.usermodel.find().exec();
  }

  async findOne(id: string) {
    const user = await this.usermodel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usermodel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true, // retourne l'utilisateur mis à jour
        runValidators: true, // applique les validateurs du schema
      })
      .exec();
  }

  async remove(id: string) {
    const user = await this.usermodel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }
    return { message: `Utilisateur ${id} supprimé avec succès`, user };
  }
}
