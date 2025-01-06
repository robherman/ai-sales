import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatEventEntity } from '../entities/chat-event.entity';

@Injectable()
export class ChatEventService {
  constructor(
    @InjectRepository(ChatEventEntity)
    private eventRepository: Repository<ChatEventEntity>,
  ) {}

  async logEvent(chatId: string, eventType: string, data: any): Promise<void> {
    const event = this.eventRepository.create({
      chatId,
      eventType,
      data,
      timestamp: new Date(),
    });
    await this.eventRepository.save(event);
  }
}
