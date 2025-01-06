import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  NotFoundException,
  Body,
  Delete,
  Query,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../decorators/user.decorator';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { ChatService } from '@lib/chat';
import { AddChatMessageDto } from '@lib/chat/dto/add-chat-message.dto';
import { CreateChatDto } from '../../../../../libs/chat/src/dto/create-chat.dto';
import { ChatAnalyticsService } from '../../../../../libs/chat/src/services/chat-analytics.service';

@ApiTags('Chat')
@ApiBearerAuth()
@Controller({
  path: '/chat',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private chatService: ChatService,
    private chatAnalytics: ChatAnalyticsService,
  ) {}

  @Post('')
  async createChat(
    @CurrentUser('userId') userId: string,
    @Body() dto: Omit<CreateChatDto, 'userId'>,
  ) {
    return this.chatService.createChat({ ...dto, userId });
  }

  @Post('/:id/message')
  async addMessage(
    @CurrentUser('userId') userId: string,
    @Body() dto: AddChatMessageDto,
    @Param('id') chatId: string,
  ) {
    const chatMessage = await this.chatService.addMessage(chatId, dto);
    return chatMessage;
  }

  @Post('/:id/feedback/:messageId')
  async feedbackMessage(
    @CurrentUser('userId') userId: string,
    @Body() dto: any,
    @Param('id') chatId: string,
    @Param('messageId') messageId: string,
  ) {
    const chatMessage = await this.chatService.updateMessageMetadata(
      chatId,
      messageId,
      { metadata: dto },
    );
    return chatMessage;
  }

  @Get('')
  async getChats(@CurrentUser() userSession: any) {
    return this.chatService.getUserChats(userSession.userId);
  }

  @Get('history')
  async getUserChats(@CurrentUser() userSession: any) {
    return this.chatService.getUserChats(userSession.userId);
  }

  @Get('metrics')
  async getChatMetrics(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @CurrentUser() userSession: any,
  ) {
    try {
      const analytics = await this.chatAnalytics.getChatAnalytics(
        userSession.userId,
      );
      const metrics = await this.chatAnalytics.getMetrics(userSession.userId);
      const start = new Date(startDate);
      const end = new Date(endDate);
      const tokenUsage = await this.chatAnalytics.getTokenUsageAnalytics(
        userSession.userId,
        start,
        end,
      );

      return { metrics, tokenUsage, analytics };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(`Failed to get analytics`);
    }
  }

  @Post('/clear')
  async clearUserChats(@CurrentUser('userId') userId: string) {
    await this.chatService.clearUserChatsHistory(userId);
    return { success: true };
  }

  @Get('/customers/:id')
  async getCustomerChats(@Param('id') id: string) {
    try {
      const result = await this.chatService.getCustomerChats(id);
      return result;
    } catch (error) {
      console.error(`Failed`, error);
      throw new InternalServerErrorException('Failed to get chats');
    }
  }

  @Get('/:id')
  async getChatById(@Param('id') id: string) {
    return this.chatService.getChatById(id);
  }

  @Get('/:id/metrics')
  async getChatByIdMetrics(
    @CurrentUser() userSession: any,
    @Param('id') chatId: string,
  ) {
    try {
      const analytics = await this.chatAnalytics.getChatAnalyticsById(chatId);
      return analytics;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(`Failed to get analytics`);
    }
  }

  @Get('/:id/history')
  async getChatHistory(@Param('id') id: string) {
    return this.chatService.getChatHistory(id);
  }

  @Get('/:id/insights')
  async getChatInsights(@Param('id') id: string) {
    const chat = await this.chatService.getChatById(id);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    return {};
  }

  @Post('/:id/clear')
  async clearChatHistory(
    @CurrentUser('userId') userId: string,
    @Param('id') chatId: string,
  ) {
    await this.chatService.clearChatHistory(chatId);
    return { success: true };
  }

  @Delete('/:id')
  async deleteChatById(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    await this.chatService.deleteChatById(id, userId);
    return { success: true };
  }
}
