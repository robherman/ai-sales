import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChatbotEntity } from '../entities/chatbot.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateChatbotDto } from '../dtos/chatbot.dto';

@Injectable()
export class ChatbotService {
  private logger = new Logger(ChatbotService.name);

  constructor(
    @InjectRepository(ChatbotEntity)
    private chatbotRepository: Repository<ChatbotEntity>,
  ) {}

  async findAll(): Promise<ChatbotEntity[]> {
    const chatbot = await this.chatbotRepository.find({
      where: { isActive: true },
    });
    return chatbot;
  }

  async findOneById(id: string): Promise<ChatbotEntity> {
    try {
      return await this.chatbotRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      this.logger.error('Chatbot not found', error, { chatbotId: id });
      throw new Error('Chatbot not found');
    }
  }

  async findOneByChannel(channel: string): Promise<ChatbotEntity | null> {
    return this.chatbotRepository.findOne({
      where: { channel, isActive: true },
    });
  }

  async findOneByName(name: string): Promise<ChatbotEntity> {
    const chatbot = await this.chatbotRepository.findOneOrFail({
      where: { name },
    });
    return chatbot;
  }

  async update(id: string, dto: UpdateChatbotDto): Promise<ChatbotEntity> {
    await this.chatbotRepository.update(id, dto);
    return this.findOneById(id);
  }
}
