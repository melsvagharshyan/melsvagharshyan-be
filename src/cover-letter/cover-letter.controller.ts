import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { CoverLetterService } from './cover-letter.service';

@Controller('cover-letter')
export class CoverLetterController {
  constructor(private readonly coverLetterService: CoverLetterService) {}

  @Get(':type')
  async getCoverLetter(@Param('type') type: string) {
    const coverLetter = await this.coverLetterService.getByType(type);
    return { type: coverLetter.type, text: coverLetter.text };
  }

  @Put(':type')
  async updateCoverLetter(
    @Param('type') type: string,
    @Body('text') text: string,
  ) {
    const coverLetter = await this.coverLetterService.updateByType(type, text);
    return { type: coverLetter.type, text: coverLetter.text };
  }
}
