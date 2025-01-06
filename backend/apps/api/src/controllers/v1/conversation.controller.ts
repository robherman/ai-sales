import {
  Controller,
  Post,
  Body,
  UseGuards,
  InternalServerErrorException,
  Res,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { CurrentUser } from '../../decorators/user.decorator';
import { Response } from 'express';
import { InitializeConversationDto } from '../../../../../libs/conversation/src/dtos/init-conv.dto';
import { ProcessMessageDto } from '../../../../../libs/conversation/src/dtos/process-conv.dto';
import { ConversationService } from '../../../../../libs/conversation/src';

@ApiTags('Customer Conversation')
@ApiBearerAuth()
@Controller({
  path: '/conversation',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class ConversationController {
  private logger = new Logger(ConversationController.name);

  constructor(private conversationService: ConversationService) {}

  @Post('initialize')
  @ApiOperation({ summary: 'Starts a conversation with customer' })
  @ApiResponse({
    status: 201,
    description: 'Conversation initialized successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async start(
    @Body() dto: InitializeConversationDto,
    @CurrentUser('userId') userId: string,
  ) {
    try {
      this.logger.log('Initializing conversation', {
        dto,
      });
      const result = await this.conversationService.start(dto, userId);
      return { data: result };
    } catch (error) {
      this.logger.error('Failed to initialize conversation', error, {
        userId,
        chatbotId: dto.chatbotId,
        customerId: dto.customerId,
      });
      throw new InternalServerErrorException(
        'Failed to initialize conversation',
      );
    }
  }

  @Post('response/generate')
  @ApiOperation({ summary: 'Generate a conversation response' })
  @ApiResponse({ status: 200, description: 'Response generated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async processMessage(
    @Body() dto: ProcessMessageDto,
    @CurrentUser('userId') userId: string,
  ): Promise<any> {
    try {
      this.logger.log(`Generating Response...`);
      return await this.conversationService.generateResponse(dto, userId);
    } catch (error) {
      this.logger.error('Response error', error, {
        userId,
        chatId: dto.chatId,
        customerId: dto.customerId,
      });
      throw new InternalServerErrorException('Generate response error');
    }
  }

  @Post('response/stream')
  @ApiOperation({ summary: 'Stream a conversation response' })
  @ApiResponse({ status: 200, description: 'Response streamed successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async streamMessage(
    @Body() dto: ProcessMessageDto,
    @CurrentUser('userId') userId: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      await this.conversationService.streamResponse(dto, userId, res);
    } catch (error) {
      this.logger.error('Streaming error', error, {
        userId,
        chatId: dto.chatId,
        customerId: dto.customerId,
      });
      throw new InternalServerErrorException('Streaming error');
    }
  }
}
