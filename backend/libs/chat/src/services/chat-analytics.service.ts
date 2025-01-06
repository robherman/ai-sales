import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ChatEntity } from '../entities/chat.entity';
import { ChatMessageEntity } from '../entities/chat-message.entity';

@Injectable()
export class ChatAnalyticsService {
  constructor(
    @InjectRepository(ChatEntity)
    private chatRepository: Repository<ChatEntity>,
    @InjectRepository(ChatMessageEntity)
    private chatMessageRepository: Repository<ChatMessageEntity>,
  ) {}

  // async getAverageChatLength(userId: string): Promise<number> {
  //   const chats = await this.chatRepository.find({
  //     where: { userId: userId },
  //     select: ['content'],
  //   });

  //   let totalMessages = 0;
  //   const totalChats = chats.length;

  //   for (const chat of chats) {
  //     totalMessages += chat.content.messages.length;
  //   }

  //   const averageLength = totalChats > 0 ? totalMessages / totalChats : 0;

  //   return averageLength;
  // }

  // async getChatAnalytics(userId: string): Promise<{
  //   averageLength: number;
  //   totalChats: number;
  //   totalMessages: number;
  //   averageMessagesPerChat: number;
  // }> {
  //   const chats = await this.chatRepository.find({
  //     where: { userId: userId },
  //     select: ['content'],
  //   });

  //   let totalMessages = 0;
  //   const totalChats = chats.length;

  //   for (const chat of chats) {
  //     totalMessages += chat.content.messages.length;
  //   }

  //   const averageLength = totalChats > 0 ? totalMessages / totalChats : 0;

  //   return {
  //     averageLength,
  //     totalChats,
  //     totalMessages,
  //     averageMessagesPerChat: averageLength,
  //   };
  // }

  // async getChatAnalyticsById(chatId: string) {
  //   const chat = await this.chatRepository.findOne({
  //     where: { id: chatId },
  //     select: ['content'],
  //   });

  //   const totalMessages = chat?.content.messages.length || 0;
  //   let totalInputTokens = 0;
  //   let totalOutputTokens = 0;
  //   let totalTokens = 0;
  //   let messageCount = 0;

  //   chat?.content?.messages.forEach((message) => {
  //     if (message.metadata && message.metadata.responseMetadata) {
  //       const { usage } = message.metadata.responseMetadata;
  //       if (usage) {
  //         totalInputTokens += usage.inputTokens || 0;
  //         totalOutputTokens += usage.outputTokens || 0;
  //         totalTokens += usage.totalTokens || 0;
  //         messageCount++;
  //       }
  //     }
  //   });

  //   return {
  //     totalMessages,
  //     totalInputTokens,
  //     totalOutputTokens,
  //     totalTokens,
  //     messageCount,
  //     averageInputTokens:
  //       messageCount > 0 ? totalInputTokens / messageCount : 0,
  //     averageOutputTokens:
  //       messageCount > 0 ? totalOutputTokens / messageCount : 0,
  //     averageTotalTokens: messageCount > 0 ? totalTokens / messageCount : 0,
  //   };
  // }

  // async getMetrics(userId: string): Promise<any> {
  //   try {
  //     return {
  //       totalInteractions: 199,
  //       averageSentiment: 'positive',
  //       mostCommonIntent: 'buy',
  //       stageProgression: 1,
  //     };
  //   } catch (error) {
  //     throw new Error('Failed to get conversation metrics');
  //   }
  // }

  async getAverageChatLength(userId: string): Promise<number> {
    const result = await this.chatMessageRepository
      .createQueryBuilder('message')
      .select('AVG(message_count)', 'averageLength')
      .innerJoin(
        (qb) =>
          qb
            .select('chat.id', 'chatId')
            .addSelect('COUNT(message.id)', 'message_count')
            .from(ChatEntity, 'chat')
            .leftJoin('chat.messages', 'message')
            .where('chat.userId = :userId', { userId })
            .groupBy('chat.id'),
        'chat_counts',
        'chat_counts.chatId = message.chatId',
      )
      .getRawOne();

    return result?.averageLength || 0;
  }

  async getChatAnalytics(userId: string): Promise<{
    averageLength: number;
    totalChats: number;
    totalMessages: number;
    averageMessagesPerChat: number;
  }> {
    const result = await this.chatRepository
      .createQueryBuilder('chat')
      .select('COUNT(DISTINCT chat.id)', 'totalChats')
      .addSelect('COUNT(message.id)', 'totalMessages')
      .leftJoin('chat.messages', 'message')
      .where('chat.userId = :userId', { userId })
      .getRawOne();

    const totalChats = parseInt(result.totalChats) || 0;
    const totalMessages = parseInt(result.totalMessages) || 0;
    const averageLength = totalChats > 0 ? totalMessages / totalChats : 0;

    return {
      averageLength,
      totalChats,
      totalMessages,
      averageMessagesPerChat: averageLength,
    };
  }

  async getChatAnalyticsById(chatId: string) {
    const messages = await this.chatMessageRepository.find({
      where: { chatId },
      select: ['metadata'],
    });

    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let totalTokens = 0;
    let completionTokens = 0;
    let promptTokens = 0;
    let messageCount = 0;

    messages.forEach((message) => {
      const { usage } = message.metadata;
      if (usage) {
        totalInputTokens += usage.inputTokens || 0;
        totalOutputTokens += usage.outputTokens || 0;
        totalTokens += usage.totalTokens || 0;
        completionTokens += usage.completionTokens || 0;
        promptTokens += usage.promptTokens || 0;
        messageCount++;
      }
    });

    return {
      totalMessages: messages.length,
      totalInputTokens,
      totalOutputTokens,
      totalTokens,
      completionTokens,
      promptTokens,
      messageCount,
      averageInputTokens:
        messageCount > 0 ? totalInputTokens / messageCount : 0,
      averageOutputTokens:
        messageCount > 0 ? totalOutputTokens / messageCount : 0,
      averageTotalTokens: messageCount > 0 ? totalTokens / messageCount : 0,
    };
  }

  async getMetrics(userId: string): Promise<any> {
    // This method remains unchanged as it returns mock data
    try {
      return {
        totalInteractions: 199,
        averageSentiment: 'positive',
        mostCommonIntent: 'buy',
        stageProgression: 1,
      };
    } catch (error) {
      throw new Error('Failed to get conversation metrics');
    }
  }

  async getTokenUsageAnalytics(userId: string, startDate: Date, endDate: Date) {
    const messages = await this.chatMessageRepository
      .createQueryBuilder('message')
      .innerJoin('message.chat', 'chat')
      .where('chat.userId = :userId', { userId })
      .andWhere('message.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .select('message.metadata')
      .getMany();

    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let totalTokens = 0;
    let messageCount = 0;

    messages.forEach((message) => {
      const { usage } = message.metadata;
      if (usage) {
        totalInputTokens += usage.inputTokens || 0;
        totalOutputTokens += usage.outputTokens || 0;
        totalTokens += usage.totalTokens || 0;
        messageCount++;
      }
    });

    return {
      totalInputTokens,
      totalOutputTokens,
      totalTokens,
      messageCount,
      averageInputTokens:
        messageCount > 0 ? totalInputTokens / messageCount : 0,
      averageOutputTokens:
        messageCount > 0 ? totalOutputTokens / messageCount : 0,
      averageTotalTokens: messageCount > 0 ? totalTokens / messageCount : 0,
    };
  }

  private calculateAverageSentiment(sentiments: string[]): string {
    const sentimentValues: any = {
      positive: 1,
      neutral: 0,
      negative: -1,
    };
    const sum = sentiments.reduce(
      (acc, sentiment) => acc + sentimentValues[sentiment],
      0,
    );
    const average = sum / sentiments.length;
    if (average > 0.3) return 'positive';
    if (average < -0.3) return 'negative';
    return 'neutral';
  }

  private getMostCommonElement(arr: string[]): string {
    return (
      arr
        .sort(
          (a, b) =>
            arr.filter((v) => v === a).length -
            arr.filter((v) => v === b).length,
        )
        .pop() || ''
    );
  }

  private getStageProgression(stages: string[]): object {
    const progression: any = {};
    stages.forEach((stage, index) => {
      if (index > 0 && stages[index - 1] !== stage) {
        const transition = `${stages[index - 1]} -> ${stage}`;
        progression[transition] = (progression[transition] || 0) + 1;
      }
    });
    return progression;
  }
}
