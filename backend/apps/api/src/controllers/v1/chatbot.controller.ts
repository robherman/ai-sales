import { Controller, Body, UseGuards, Param, Get, Put } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { ChatbotService } from '../../../../../libs/chatbot/src';
import { UpdateChatbotDto } from '../../../../../libs/chatbot/src/dtos/chatbot.dto';

@ApiTags('Chatbot')
@ApiBearerAuth()
@Controller({
  path: '/chatbots',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class ChatbotController {
  constructor(private chatbotService: ChatbotService) {}

  @Get('/')
  async getChatbots() {
    const chatbots = await this.chatbotService.findAll();
    return chatbots;
  }

  @Get('/:id')
  async getChatbot(@Param('id') id: string) {
    const config = await this.chatbotService.findOneById(id);
    return config;
  }

  @Put('/:id')
  async updateChatbot(@Body() dto: UpdateChatbotDto, @Param('id') id: string) {
    const config = await this.chatbotService.update(id, dto);
    return config;
  }
}
