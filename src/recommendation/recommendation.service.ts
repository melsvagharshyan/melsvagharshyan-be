import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { handleDeleteImage, handleUpload } from 'src/cloud/cloudinary';
import { s3 } from 'src/cloud/s3';
import { Recommendation } from 'src/schemas/recommendation.schema';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { AzureBlobService } from 'src/upload/azure-blob.service';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectModel('Recommendation')
    private recommendationModel: Model<Recommendation>,
    private readonly azureBlobService: AzureBlobService,
  ) {}

  async createRecommendation(
    data: Partial<Recommendation>,
  ): Promise<Recommendation> {
    //Azure
    // const urlAzure = await this.azureBlobService.uploadBase64Image(
    //   data.image || '',
    // );

    // AWS
    const Image: any = data.image || '';
    const base64Data = Buffer.from(
      Image.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );

    const type = Image.split(';')[0].split('/')[1];

    const bucketName = process.env.AWS_BUCKET_NAME;
    const fileKey = `${data.fullName}.${type}`;

    const command = new PutObjectCommand({
      Key: fileKey,
      Bucket: bucketName,
      Body: base64Data,
      ContentEncoding: 'base64', // required
      ContentType: `image/${type}`, // required. Notice the back ticks
    });

    const res = await s3.send(command);

    const url = `https://${bucketName}.s3.amazonaws.com/${fileKey}`;

    let image = {
      public_id: '',
      url: '',
    };

    if (data?.image) {
      // const result = await handleUploadImagekit(data?.image);
      // const result = await handleUpload(data?.image);
      image = {
        public_id: fileKey,
        url: url,
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

      const bucketName = process.env.AWS_BUCKET_NAME;

      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: imageId, // e.g. "images/123-image.png"
      });

      await s3.send(command);
    }

    const result = await this.recommendationModel.deleteOne({ _id });

    return { deleted: result.deletedCount > 0 };
  }
}
