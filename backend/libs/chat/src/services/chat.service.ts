import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatEntity } from '../entities/chat.entity';
import { ChatEventService } from './chat-event.service';
import { AddChatMessageDto } from '../dto/add-chat-message.dto';
import { CreateChatDto } from '../dto/create-chat.dto';
import { ChatMessageEntity } from '../entities/chat-message.entity';

@Injectable()
export class ChatService {
  private logger = new Logger(ChatService.name);

  constructor(
    @InjectRepository(ChatEntity)
    private chatRepository: Repository<ChatEntity>,
    private chatEventService: ChatEventService,
    @InjectRepository(ChatMessageEntity)
    private chatMessageRepository: Repository<ChatMessageEntity>,
  ) {}

  async createChat(dto: CreateChatDto): Promise<ChatEntity> {
    this.logger.log(`Create chat...`);
    let chat = this.chatRepository.create({
      ...dto,
      messages: [],
      title: dto.title ?? 'auto-gen-title',
      status: 'active',
    });
    chat = await this.chatRepository.save(chat);
    await this.chatEventService.logEvent(chat.id, 'chat_created', chat);
    return this.getChatById(chat.id);
  }

  async getChatById(chatId: string): Promise<ChatEntity> {
    this.logger.log(`Get chat by id`);
    return this.chatRepository.findOneOrFail({
      where: { id: chatId },
      relations: ['customer', 'messages'],
    });
  }

  async getActiveChat(
    customerId: string,
    companyId: string,
    channel: string,
  ): Promise<ChatEntity | null> {
    this.logger.log(`Get chat by id`);
    return this.chatRepository.findOne({
      where: { customerId, companyId, channel },
      relations: ['customer', 'messages'],
    });
  }

  async updateChat(
    chatId: string,
    updateData: Partial<ChatEntity>,
  ): Promise<ChatEntity> {
    await this.chatRepository.update(chatId, updateData);
    const updatedChat = await this.getChatById(chatId);
    await this.chatEventService.logEvent(chatId, 'chat_updated', updateData);
    return updatedChat;
  }

  async updateContext(chatId: string, context: any): Promise<ChatEntity> {
    const chat = await this.chatRepository.findOneOrFail({
      where: { id: chatId },
    });
    chat.context = { ...chat.context, ...context };
    const updatedChat = await this.chatRepository.save(chat);
    await this.chatEventService.logEvent(
      chatId,
      'chat_context_updated',
      context,
    );
    return updatedChat;
  }

  async addMessage(
    chatId: string,
    dto: AddChatMessageDto,
  ): Promise<ChatMessageEntity> {
    const message = this.chatMessageRepository.create({ ...dto, chatId });
    const savedMessage = await this.chatMessageRepository.save(message);
    await this.chatEventService.logEvent(
      chatId,
      'chat_message_added',
      savedMessage,
    );
    return savedMessage;
  }

  async updateMessageMetadata(
    chatId: string,
    messageId: string,
    metadata: any,
  ): Promise<ChatMessageEntity> {
    const message = await this.chatMessageRepository.findOneOrFail({
      where: { id: messageId, chatId },
    });
    message.metadata = { ...message.metadata, ...metadata };
    const updatedMessage = await this.chatMessageRepository.save(message);
    await this.chatEventService.logEvent(
      chatId,
      'chat_message_updated',
      updatedMessage,
    );
    return updatedMessage;
  }

  async getChatLastMessage(chatId: string): Promise<ChatMessageEntity | null> {
    this.logger.log(`Get chat last message`);
    return this.chatMessageRepository.findOne({
      where: { chatId },
      order: { createdAt: 'DESC' },
    });
  }

  async getChatHistory(
    chatId: string,
    maxHistory = 100,
  ): Promise<ChatMessageEntity[]> {
    this.logger.log(`Get chat history`);
    return this.chatMessageRepository.find({
      where: { chatId },
      order: { createdAt: 'ASC' },
    });
  }

  async getUserChats(userId: string): Promise<ChatEntity[]> {
    this.logger.log(`Get user chats`);
    return this.chatRepository.find({
      where: { userId },
      relations: ['customer'],
    });
  }

  async getCustomerChats(customerId: string): Promise<ChatEntity[]> {
    try {
      this.logger.log(`Get customer chats`);
      const result = await this.chatRepository.find({
        where: { customerId },
        // relations: ['customer'],
      });
      return result;
    } catch (error) {
      this.logger.error(`Error`, error);
      throw new Error('Failed to execute');
    }
  }

  async clearChatHistory(chatId: string): Promise<void> {
    await this.chatMessageRepository.delete({ chatId });
    await this.chatEventService.logEvent(chatId, 'chat_history_deleted', {});
  }

  async clearUserChatsHistory(userId: string): Promise<void> {
    const chats = await this.getUserChats(userId);
    for (const chat of chats) {
      await this.clearChatHistory(chat.id);
    }
  }

  async clearCustomerChatHistory(customerId: string): Promise<void> {
    const chats = await this.getCustomerChats(customerId);
    for (const chat of chats) {
      await this.clearChatHistory(chat.id);
    }
  }

  async deleteChatById(chatId: string, userId: string): Promise<void> {
    await this.chatRepository.delete({ id: chatId, userId });
    await this.chatEventService.logEvent(chatId, 'chat_deleted', {});
  }
}
