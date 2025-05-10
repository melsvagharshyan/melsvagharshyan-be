import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { Recommendation } from 'src/schemas/recommendation.schema';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post()
  async create(@Body() data: Partial<Recommendation>) {
    try {
      const created =
        await this.recommendationService.createRecommendation(data);
      return { message: 'Created', data: created };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to create recommendation',
          error: error.message || error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const data = await this.recommendationService.getAllRecommendations();
      return { data };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to fetch recommendations',
          error: error.message || error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
