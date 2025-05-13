import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { handleDeleteImage, handleUpload } from 'src/cloud/cloudinary';
import { Recommendation } from 'src/schemas/recommendation.schema';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectModel('Recommendation')
    private recommendationModel: Model<Recommendation>,
  ) {}

  async createRecommendation(
    data: Partial<Recommendation>,
  ): Promise<Recommendation> {
    let image = {
      public_id: '',
      url: '',
    };

    if (data?.image) {
      // const result = await handleUploadImagekit(data?.image);
      const result = await handleUpload(data?.image);
      image = {
        public_id: result.fileId,
        url: result.url,
      };
    }

    const newRecommendation = new this.recommendationModel({ ...data, image });

    const newData = await newRecommendation.save();
    return newData;
  }

  async getAllRecommendations(): Promise<Recommendation[]> {
    return await this.recommendationModel.find().exec();
  }

  async approve(_id: string): Promise<Recommendation | null> {
    return this.recommendationModel.findByIdAndUpdate(
      _id,
      { approved: true },
      { new: true },
    );
  }

  async findAllApproved(): Promise<Recommendation[]> {
    return this.recommendationModel.find({ approved: true });
  }

  async deleteRecommendationById(_id: string): Promise<{ deleted: boolean }> {
    const item = await this.recommendationModel.findById(_id);

    const imageId = item?.image?.public_id || '';

    if (imageId) {
      // await handleDeleteImagekitImage(imageId);
      await handleDeleteImage(imageId);
    }

    const result = await this.recommendationModel.deleteOne({ _id });

    return { deleted: result.deletedCount > 0 };
  }
}
