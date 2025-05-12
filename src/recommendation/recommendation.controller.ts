import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { Recommendation } from 'src/schemas/recommendation.schema';
import axios from 'axios';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post()
  async create(@Body() data: Partial<Recommendation>) {
    try {
      const created =
        await this.recommendationService.createRecommendation(data);

      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      const message = `🆕 New Recommendation Created!       👤 By: ${data?.fullName}`;

      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: message,
      });

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

  // recommendation.controller.ts
  @Patch(':_id/approve')
  async approveRecommendation(@Param('_id') id: string) {
    return this.recommendationService.approve(id);
  }

  @Get('approved')
  async getApprovedRecommendations() {
    return this.recommendationService.findAllApproved();
  }

  @Delete(':_id/delete')
  async delete(@Param('_id') id: string) {
    try {
      const result =
        await this.recommendationService.deleteRecommendationById(id);
      if (!result.deleted) {
        throw new HttpException(
          'Recommendation not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return { message: 'Deleted successfully' };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to delete recommendation',
          error: error.message || error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
