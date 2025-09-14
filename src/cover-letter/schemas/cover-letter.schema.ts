import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CoverLetterDocument = CoverLetter & Document;

@Schema()
export class CoverLetter {
  @Prop({ required: true, unique: true })
  type: string;

  @Prop({ required: true })
  text: string;
}

export const CoverLetterSchema = SchemaFactory.createForClass(CoverLetter);
