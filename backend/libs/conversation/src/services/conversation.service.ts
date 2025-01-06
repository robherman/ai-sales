import { Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import { StreamData } from 'ai';
import { AiService } from '../../../ai-core/src';
import { ChatService } from '../../../chat/src';
import { ContextManagerService } from '../../../context-manager/src';
import { ContextInfo } from '../../../context-manager/src/interfaces/context.interface';
import { InitializeConversationDto } from '../dtos/init-conv.dto';
import { ProcessMessageDto } from '../dtos/process-conv.dto';
import { PromptsService } from '../../../prompts/src';
import { ConversationSettingsService } from './conversation-settings.service';
import { GreetingsService } from './greetings.service';
import { createStreamableValue } from 'ai/rsc';
import { LangChainAdapter } from 'ai';

@Injectable()
export class ConversationService {
  private logger = new Logger(ConversationService.name);

  constructor(
    private aiService: AiService,
    private chatService: ChatService,
    private greetingService: GreetingsService,
    private contextService: ContextManagerService,
    private promptsService: PromptsService,
    private conversationSettingsService: ConversationSettingsService,
  ) {}

  async start(dto: InitializeConversationDto, userId: string) {
    try {
      this.logger.log(`Start conversation`);
      let chat = await this.chatService.getActiveChat(
        userId,
        dto.customerId,
        dto.channel,
      );
      if (!chat) {
        chat = await this.chatService.createChat({ ...dto, userId });
      }
      const aiResponse = await this.processMessage({
        ...dto,
        message: 'Hola',
        chatId: chat.id,
      });

      return { chat: { id: chat.id }, aiResponse };
    } catch (err) {
      this.logger.error(`Failed to initialize conversation`, err);
      throw new Error('Conversation init failed');
    }
  }

  async generateResponse(
    dto: ProcessMessageDto,
    userId: string,
  ): Promise<{ aiResponse: string; toolResults: any }> {
    const { aiResponse, toolResults } = await this.processMessage(dto);
    return {
      aiResponse: aiResponse || '',
      toolResults,
    };
  }

  async streamResponse(
    dto: ProcessMessageDto,
    userId: string,
    res: Response,
  ): Promise<void> {
    const streamData = new StreamData();
    streamData.append('initialized call');
    try {
      const { aiStream } = await this.processMessage(dto, true);
      if (aiStream) {
        aiStream.pipeDataStreamToResponse(res, {
          data: streamData,
        });
      } else {
        throw new Error('AI stream not generated');
      }
    } catch (error) {
      this.logger.error('Streaming error', error);
      streamData.append('Streaming error occurred');
      res.status(500).json({ error: 'An error occurred during streaming' });
    } finally {
      streamData.close();
    }
  }

  private async processMessage(
    dto: ProcessMessageDto,
    isStreaming: boolean = false,
  ) {
    this.logger.debug(`Process chat message`);
    const context = await this.contextService.getContext(
      dto.chatId,
      dto.message,
      dto.channel,
    );
    const settings =
      await this.conversationSettingsService.getDefaultSettings();
    await this.chatService.addMessage(dto.chatId, {
      role: 'user',
      content: dto.message,
    });
    await this.chatService.updateChat(dto.chatId, {
      context,
    });
    const history = await this.chatService.getChatHistory(
      dto.chatId,
      settings.maxHistory,
    );

    const idPrompt = await this.promptsService.renderPrompt(
      context.systemPromptId!,
      context,
    );
    const instructions = await this.promptsService.renderPrompt(
      context.instructionsPromptId!,
      context,
    );
    // this.logger.debug(`ID PROMPT`, idPrompt);
    // this.logger.debug(`INSTRUCTIONS PROMPT`, instructions);

    const messages = [
      {
        role: 'system',
        content: idPrompt,
      },
      {
        role: 'user',
        content: instructions,
      },
      {
        role: 'assistant',
        content: `Entendido.`,
      },
      ...history,
    ];
    // const aiConfig = {
    //   model: context.model,
    //   temperature: context.temperature,
    //   maxTokens: context.maxTokens,
    //   tools: {},
    //   messages,
    // };
    const lcConfig = {
      model: context.model,
      temperature: context.temperature,
      maxTokens: context.maxTokens,
      messages,
      tools: [],
    };
    let aiResponse, toolResults, aiStream;
    if (isStreaming) {
      const agentStream = await this.aiService.streamAgentResponse({
        ...lcConfig,
        streamData: aiStream,
        // onFinish: (data) => this.handleFinishResponse(dto.chatId, data),
      });
      aiStream = agentStream;
    } else {
      const result = await this.aiService.generateAgentResponse(lcConfig);
      await this.handleFinishResponse(dto.chatId, dto.channel, { ...result });
      aiResponse = result.content;
      toolResults = result.toolResults;
    }
    return { aiResponse, toolResults, aiStream };
  }

  private async handleFinishResponse(
    chatId: string,
    channel: string,
    data: {
      content: string;
      toolResults?: any;
      metadata?: Record<string, any>;
      usage?: {
        inputTokens?: number;
        outputTokens?: number;
        totalTokens?: number;
      };
      finishReason?: string;
    },
  ) {
    try {
      const aiMessage = {
        role: 'assistant' as any,
        ...data,
      };
      await this.chatService.addMessage(chatId, aiMessage);
      const context = await this.contextService.getContext(
        chatId,
        data.content,
        channel,
      );
      await this.chatService.updateChat(chatId, {
        context,
      });
      this.logger.log(`Processing completed`);
    } catch (error) {
      this.logger.error('Failed to handle finish response', error, {
        chatId: chatId,
        data: JSON.stringify(data),
      });
    }
  }

  private async handlePostResponseActions(
    context: ContextInfo,
    aiResponse: string,
  ) {
    // Implement any post-response logic here
    // For example:
    // - Analyze sentiment
    // - Update customer profile based on the conversation
    // - Trigger follow-up actions (e.g., send an email, create a task)
    // - Log analytics data
    this.logger.log(`Handle Post Response`);
  }
}
