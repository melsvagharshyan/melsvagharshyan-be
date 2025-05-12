import { Schema, Document } from 'mongoose';

export interface Recommendation extends Document {
  fullName: string;
  profession: string;
  recommendation: string;
  stars: number;
  image?: {
    public_id: string;
    url: string;
  };
  approved: boolean;
}

export const RecommendationSchema = new Schema({
  fullName: { type: String, required: true },
  profession: { type: String, required: true },
  recommendation: { type: String, required: true },
  stars: { type: Number, required: true },
  image: {
    public_id: { type: String, required: false },
    url: { type: String, required: false },
  },
  approved: { type: Boolean, default: false },
});
