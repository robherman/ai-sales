import { Injectable, Logger } from '@nestjs/common';
import * as natural from 'natural';
import { BedrockAIService } from '../providers/ai-sdk/bedrock';
import { BedrockModel } from '../const/models.const';
import {
  AIMessage,
  filterMessages,
  HumanMessage,
  mergeMessageRuns,
  SystemMessage,
} from '@langchain/core/messages';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { ToolCall } from '@langchain/core/dist/messages/tool';
import { ChatMessageEntity } from '../../../chat/src/entities/chat-message.entity';
import { LcChatbotService } from '../providers/langchain/lc-chatbot';
import { LcChatbotAgentService } from '../providers/langchain/lc-chatbot-agent';
import { LcEmbeddingService } from '../providers/langchain/lc-embeddings';

@Injectable()
export class AiService {
  private logger = new Logger(AiService.name);
  private tokenizer: natural.RegexpTokenizer;

  constructor(
    private bedrockAIService: BedrockAIService,
    private lcChatbotService: LcChatbotService,
    private lcChatbotAgentService: LcChatbotAgentService,
    private lcEmbeddingService: LcEmbeddingService,
  ) {
    this.tokenizer = new natural.WordTokenizer();
  }

  async streamResponse(config: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    maxRetries?: number;
    tools?: Record<string, any>;
    messages?: ChatMessageEntity[] | { role: string; content: string }[];
    systemPrompt?: string;
    prompt?: string;
    onFinish?: (data: any) => void;
    onStepFinish?: (data: any) => void;
  }) {
    try {
      const result = await this.bedrockAIService.streamText({
        ...config,
        maxRetries: 3,
        onFinish: async (data) => {
          config.onFinish && config.onFinish(data);
        },
        onStepFinish: async (data: any) => {
          config.onStepFinish && config.onStepFinish(data);
        },
      });
      return result;
    } catch (error) {
      this.logger.error('Failed to stream AI response', error);
      throw new Error('Failed to stream AI response');
    }
  }

  async generateResponse(config: {
    model: string;
    temperature: number;
    maxTokens: number;
    messages: ChatMessageEntity[] | { role: string; content: string }[];
    tools?: Record<string, any>;
  }): Promise<{
    content: string;
    toolResults: { [x: string]: any }[];
    metadata?: Record<string, any>;
    usage?: {
      inputTokens?: number;
      outputTokens?: number;
      totalTokens?: number;
    };
    finishReason?: string;
  }> {
    try {
      const response = await this.bedrockAIService.generateText({
        ...config,
        maxRetries: 3,
      });
      return {
        content: response.text.trim(),
        toolResults: response.toolResults,
        metadata: response.experimental_providerMetadata,
        usage: {
          inputTokens: response.usage?.promptTokens,
          outputTokens: response.usage?.completionTokens,
          totalTokens: response.usage?.totalTokens,
        },
        finishReason: response.finishReason,
      };
    } catch (error) {
      this.logger.error('Failed to generate AI response', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async generateLcResponse(config: {
    model: string;
    temperature: number;
    maxTokens: number;
    messages: ChatMessageEntity[] | { role: string; content: string }[];
    tools: DynamicStructuredTool[];
  }): Promise<{
    content: string;
    toolResults?: ToolCall[];
    metadata?: Record<string, any>;
    usage?: {
      inputTokens?: number;
      outputTokens?: number;
      totalTokens?: number;
    };
    finishReason?: string;
  }> {
    try {
      const baseMessages = config.messages?.map((m) => {
        if (m.role === 'assistant')
          return new AIMessage({ content: m.content });
        if (m.role === 'user') return new HumanMessage({ content: m.content });
        if (m.role === 'system')
          return new SystemMessage({ content: m.content });
        throw new Error('Invalid message type');
      });
      const filtered = filterMessages(baseMessages, {
        includeTypes: ['ai', 'human', 'system'],
      });
      const merged = mergeMessageRuns(filtered);
      const response = await this.lcChatbotService.generateText({
        ...config,
        messages: merged,
      });
      return {
        content: response.content as string,
        toolResults: response.tool_calls,
        metadata: response.response_metadata,
        usage: {
          inputTokens: response.usage_metadata?.input_tokens,
          outputTokens: response.usage_metadata?.output_tokens,
          totalTokens: response.usage_metadata?.total_tokens,
        },
        finishReason: response.response_metadata?.finish_reason,
      };
    } catch (error) {
      this.logger.error('Failed to generate AI response', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async generateAgentResponse(config: {
    model: string;
    temperature: number;
    maxTokens: number;
    messages: ChatMessageEntity[] | { role: string; content: string }[];
    tools: DynamicStructuredTool[];
  }): Promise<{
    content: string;
    toolResults?: ToolCall[];
    metadata?: Record<string, any>;
    usage?: {
      inputTokens?: number;
      outputTokens?: number;
      totalTokens?: number;
    };
    finishReason?: string;
  }> {
    try {
      this.logger.log(`Generating Agent Response`);
      const baseMessages = config.messages?.map((m) => {
        if (m.role === 'assistant')
          return new AIMessage({ content: m.content });
        if (m.role === 'user') return new HumanMessage({ content: m.content });
        if (m.role === 'system')
          return new SystemMessage({ content: m.content });
        throw new Error('Invalid message type');
      });
      const filtered = filterMessages(baseMessages, {
        includeTypes: ['ai', 'human', 'system'],
      });
      const merged = mergeMessageRuns(filtered);
      this.logger.log(`History filtered & merged`);
      const response = await this.lcChatbotAgentService.generateResponse({
        ...config,
        messages: merged,
      });
      return {
        content: response.content as string,
        toolResults: response.tool_calls,
        metadata: response.response_metadata,
        usage: {
          inputTokens: response.usage_metadata?.input_tokens,
          outputTokens: response.usage_metadata?.output_tokens,
          totalTokens: response.usage_metadata?.total_tokens,
        },
        finishReason: response.response_metadata?.finish_reason,
      };
    } catch (error) {
      this.logger.error('Failed to generate AI response', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async streamAgentResponse(config: {
    model: string;
    temperature: number;
    maxTokens: number;
    messages: ChatMessageEntity[] | { role: string; content: string }[];
    tools: DynamicStructuredTool[];
    streamData?: any;
  }): Promise<any> {
    try {
      this.logger.log(`Generating Agent Response`);
      const baseMessages = config.messages?.map((m) => {
        if (m.role === 'assistant')
          return new AIMessage({ content: m.content });
        if (m.role === 'user') return new HumanMessage({ content: m.content });
        if (m.role === 'system')
          return new SystemMessage({ content: m.content });
        throw new Error('Invalid message type');
      });
      const filtered = filterMessages(baseMessages, {
        includeTypes: ['ai', 'human', 'system'],
      });
      const merged = mergeMessageRuns(filtered);
      this.logger.log(`History filtered & merged`);
      return await this.lcChatbotAgentService.streamResponse({
        ...config,
        messages: merged,
      });
    } catch (error) {
      this.logger.error('Failed to stream agent response', error);
      throw new Error('Failed to stream agent response');
    }
  }

  async generateObjectResponse(config: {
    model: string;
    temperature: number;
    maxTokens: number;
    messages: any[];
    schema: any;
  }): Promise<{ content: any }> {
    try {
      const response = await this.bedrockAIService.generateObject({
        ...config,
        maxRetries: 3,
      });
      return {
        content: response.object,
      };
    } catch (error) {
      this.logger.error('Failed to generate AI response', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async analyzeImage(imageUrl: string): Promise<object> {
    // Mock image analysis
    return {
      url: imageUrl,
      objects: ['person', 'car', 'tree'],
      dominantColors: ['blue', 'green'],
      estimatedAge: Math.floor(Math.random() * 50) + 20,
      mood: ['happy', 'neutral', 'sad'][Math.floor(Math.random() * 3)],
    };
  }

  async generateImage(prompt: string): Promise<string> {
    this.logger.warn('Image generation not implemented');
    return '';
  }

  async summarizeText(text: string, maxLength: number = 100): Promise<string> {
    const tokens = this.tokenizer.tokenize(text);

    if (tokens.length <= maxLength) {
      return text;
    }

    const { content } = await this.generateResponse({
      model: BedrockModel.CLAUDE_3_HAIKU,
      temperature: 0.5,
      maxTokens: maxLength * 2,
      messages: [
        {
          role: 'system',
          content: 'You are a text summarization assistant.',
        },
        {
          role: 'user',
          content: `Summarize the following text in about ${maxLength} words:\n\n${text}`,
        },
      ],
    });

    return content;
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    this.logger.warn('Text translation not implemented');
    return text;
  }

  getEmbeddingInstance() {
    return this.lcEmbeddingService.Instance;
  }

  embedText(value: string) {
    return this.lcEmbeddingService.embed(value);
  }

  embedDocuments(values: string[]) {
    return this.lcEmbeddingService.embedMany(values);
  }
}
