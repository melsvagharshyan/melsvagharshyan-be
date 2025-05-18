import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { RecommendationSchema } from 'src/schemas/recommendation.schema';
import { AzureBlobService } from 'src/upload/azure-blob.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Recommendation', schema: RecommendationSchema },
    ]),
  ],
  controllers: [RecommendationController],
  providers: [RecommendationService, AzureBlobService],
})
export class RecommendationModule {}
