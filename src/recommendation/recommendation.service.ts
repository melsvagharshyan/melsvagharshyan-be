import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { handleUpload } from 'src/cloudinary';
import { Recommendation } from 'src/schemas/recommendation.schema';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectModel('Recommendation')
    private recommendationModel: Model<Recommendation>,
  ) {}

  // Create a new recommendation
  async createRecommendation(
    data: Partial<Recommendation>,
  ): Promise<Recommendation> {
    let image = ''; // Set the default value to null in case image is not provided

    // If an image is provided, upload it to Cloudinary
    if (data?.image) {
      const result = await handleUpload(data?.image as any);
      image = result.secure_url;
    }

    // Create a new recommendation, optionally including the image
    const newRecommendation = new this.recommendationModel({ ...data, image });

    const newData = await newRecommendation.save();
    return newData;
  }

  // Find all recommendations
  async getAllRecommendations(): Promise<Recommendation[]> {
    return await this.recommendationModel.find().exec();
  }

  // recommendation.service.ts
  async approve(_id: string): Promise<Recommendation | null> {
    return this.recommendationModel.findByIdAndUpdate(
      _id,
      { approved: true },
      { new: true },
    );
  }

  // recommendation.service.ts
  async findAllApproved(): Promise<Recommendation[]> {
    return this.recommendationModel.find({ approved: true });
  }

  // Delete a recommendation by ID
  async deleteRecommendationById(_id: string): Promise<{ deleted: boolean }> {
    const result = await this.recommendationModel.deleteOne({ _id });
    return { deleted: result.deletedCount > 0 };
  }
}
