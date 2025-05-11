import { Schema, Document } from 'mongoose';

export interface Recommendation extends Document {
  fullName: string;
  profession: string;
  recommendation: string;
  stars: number;
  image?: string;
  approved: boolean; // ✅ new field
}

export const RecommendationSchema = new Schema({
  fullName: { type: String, required: true },
  profession: { type: String, required: true },
  recommendation: { type: String, required: true },
  stars: { type: Number, required: true },
  image: { type: String, required: false },
  approved: { type: Boolean, default: false }, // ✅ new field
});
