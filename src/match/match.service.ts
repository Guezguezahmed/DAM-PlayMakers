// src/match/match.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match, Statut } from 'src/schemas/match.schema';
import { Equipe } from 'src/schemas/equipe.schema'; // To update team stats
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<Match>,
    @InjectModel(Equipe.name) private equipeModel: Model<Equipe>, // Inject Equipe Model
  ) {}

  // **C**REATE
  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    if (createMatchDto.id_equipe1 === createMatchDto.id_equipe2) {
        throw new BadRequestException('Une équipe ne peut pas jouer contre elle-même.');
    }
    const newMatch = new this.matchModel(createMatchDto);
    return newMatch.save();
  }

  // **R**EAD All
  findAll(): Promise<Match[]> {
    return this.matchModel
      .find()
      .populate('id_equipe1', 'nom')
      .populate('id_equipe2', 'nom')
      .populate('id_terrain', 'localisation')
      .populate('id_arbitre', 'nom prenom')
      .exec();
  }
  
  // **R**EAD One
  findOne(id: string): Promise<Match | null> {
    return this.matchModel.findById(id).exec();
  }

  // **U**PDATE (General + Stat update logic)
  async update(id: string, updateMatchDto: UpdateMatchDto): Promise<Match | null> {
    const existingMatch = await this.matchModel.findById(id).exec();
    
    if (!existingMatch) {
        return null;
    }

    // Check if the match is transitioning to TERMINE and scores are provided
    const isFinishing = updateMatchDto.statut === Statut.TERMINE && existingMatch.statut !== Statut.TERMINE;
    const scoresProvided = updateMatchDto.score_eq1 !== undefined && updateMatchDto.score_eq2 !== undefined;

    if (isFinishing && !scoresProvided) {
        throw new BadRequestException("Les scores sont obligatoires lors du changement de statut à TERMINE.");
    }
    
    const updatedMatch = await this.matchModel
      .findByIdAndUpdate(id, updateMatchDto, { new: true, runValidators: true })
      .exec();

    // If the match is finished, update team statistics
    if (updatedMatch && updatedMatch.statut === Statut.TERMINE && isFinishing) {
        await this.updateTeamStats(updatedMatch);
    }

    return updatedMatch;
  }
  
  // Logic to update team stats
  private async updateTeamStats(match: Match): Promise<void> {
    const { id_equipe1, id_equipe2, score_eq1, score_eq2 } = match;

    const statsUpdate1 = this.calculateStatsUpdate(score_eq1, score_eq2);
    const statsUpdate2 = this.calculateStatsUpdate(score_eq2, score_eq1);

    // Update Team 1
    await this.equipeModel.findByIdAndUpdate(id_equipe1, {
        $inc: {
            'stats.nbrMatchJoue': 1,
            'stats.matchWin': statsUpdate1.matchWin,
            'stats.matchDraw': statsUpdate1.matchDraw,
            'stats.matchLoose': statsUpdate1.matchLoose,
            'stats.nbrButMarques': score_eq1,
            'stats.nbrButEncaisse': score_eq2,
        }
    }).exec();

    // Update Team 2
    await this.equipeModel.findByIdAndUpdate(id_equipe2, {
        $inc: {
            'stats.nbrMatchJoue': 1,
            'stats.matchWin': statsUpdate2.matchWin,
            'stats.matchDraw': statsUpdate2.matchDraw,
            'stats.matchLoose': statsUpdate2.matchLoose,
            'stats.nbrButMarques': score_eq2,
            'stats.nbrButEncaisse': score_eq1,
        }
    }).exec();
  }

  // Helper to determine Win/Draw/Loss based on scores
  private calculateStatsUpdate(score1: number, score2: number) {
      if (score1 > score2) return { matchWin: 1, matchDraw: 0, matchLoose: 0 };
      if (score1 < score2) return { matchWin: 0, matchDraw: 0, matchLoose: 1 };
      return { matchWin: 0, matchDraw: 1, matchLoose: 0 };
  }


  // **D**ELETE
  remove(id: string): Promise<any> {
    return this.matchModel.findByIdAndDelete(id).exec();
  }
}