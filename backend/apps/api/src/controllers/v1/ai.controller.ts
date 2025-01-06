import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { AiService } from '../../../../../libs/ai-core/src/services/ai.service';

@ApiTags('AI')
@ApiBearerAuth()
@Controller({
  path: '/ai',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class AIController {
  constructor(private aiService: AiService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generateText(@Body() body: { messages: any[] }) {
    return this.aiService.generateResponse({
      ...body,
      model: '',
      temperature: 0,
      maxTokens: 0,
    });
  }

  @Post('generate-image')
  @UseGuards(JwtAuthGuard)
  async generateImage(@Body() body: { prompt: string }) {
    return this.aiService.generateImage(body.prompt);
  }

  @Post('analyze-image')
  @UseGuards(JwtAuthGuard)
  async analyzeImage(@Body() body: { imageUrl: string }) {
    return this.aiService.analyzeImage(body.imageUrl);
  }

  @Post('translate')
  @UseGuards(JwtAuthGuard)
  async translateText(@Body() body: { text: string; targetLanguage: string }) {
    return this.aiService.translateText(body.text, body.targetLanguage);
  }

  @Post('summarize')
  @UseGuards(JwtAuthGuard)
  async summarizeText(@Body() body: { text: string; maxLength?: number }) {
    return this.aiService.summarizeText(body.text, body.maxLength);
  }

  @Post('stream')
  @UseGuards(JwtAuthGuard)
  async streamResponse(@Body() body: { messages: any[] }) {
    return (
      await this.aiService.streamResponse({ ...body })
    ).toDataStreamResponse();
  }
}
