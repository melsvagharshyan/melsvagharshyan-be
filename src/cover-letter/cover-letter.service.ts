import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CoverLetter,
  CoverLetterDocument,
} from './schemas/cover-letter.schema';

@Injectable()
export class CoverLetterService {
  constructor(
    @InjectModel(CoverLetter.name)
    private coverLetterModel: Model<CoverLetterDocument>,
  ) {}

  async getByType(type: string): Promise<CoverLetter> {
    const coverLetter = await this.coverLetterModel.findOne({ type });
    if (!coverLetter) {
      throw new NotFoundException(`Cover letter of type "${type}" not found`);
    }
    return coverLetter;
  }

  async updateByType(type: string, text: string): Promise<CoverLetter> {
    const updated = await this.coverLetterModel.findOneAndUpdate(
      { type },
      { text },
      { new: true, upsert: true }, // creates if not exist
    );
    return updated;
  }
}
