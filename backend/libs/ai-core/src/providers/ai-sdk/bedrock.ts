import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { Injectable, Logger } from '@nestjs/common';
import {
  generateText as aiGenerateText,
  LanguageModelV1,
  streamText as aiStreamText,
  streamObject as aiStreamObject,
  generateObject as aiGenerateObject,
  embed as aiEmbed,
  embedMany as aiEmbedMany,
  cosineSimilarity as aiCosineSimilarity,
} from 'ai';
import { BedrockModel } from '../../const/models.const';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BedrockAIService {
  private instance: LanguageModelV1;
  private embedding: any;
  private logger = new Logger(BedrockAIService.name);

  constructor(private configService: ConfigService) {}

  private async init(model?: string, embedding?: string, params?: any) {
    const bedrock = createAmazonBedrock({
      region: this.configService.get('ai.bedrock.region'),
      accessKeyId: this.configService.get('ai.bedrock.accessKey')!,
      secretAccessKey: this.configService.get('ai.bedrock.secretKey')!,
    });

    this.instance = bedrock(model || BedrockModel.CLAUDE_3_HAIKU, {
      //   additionalModelRequestFields: { top_k: 350 },
    });

    this.embedding = bedrock.embedding(
      embedding || BedrockModel.TITAN_EMBEDDING_V2,
      {
        dimensions: 512,
        normalize: true,
      },
    );
  }

  async embed(value: string) {
    const { embedding } = await aiEmbed({
      model: this.embedding,
      value,
    });
    return embedding;
  }

  async embedMany(values: string[]) {
    const { embeddings } = await aiEmbedMany({
      model: this.embedding,
      values,
    });
    return embeddings;
  }

  /*
   Cosine Similarity:
   - A high value (close to 1) indicates that the vectors are very similar
   - A low value (close to -1) indicates that they are different.
   */
  async similarity(input: string, compare: string[]) {
    const embedInput = await this.embed(input);
    const embedInputs = await this.embedMany(compare);

    return aiCosineSimilarity(embedInput, embedInputs[0]);
  }

  async streamText({
    model = BedrockModel.CLAUDE_3_HAIKU,
    temperature = 0,
    maxTokens = 2048,
    maxRetries = 3,
    tools = {},
    messages = [],
    systemPrompt,
    prompt,
    onFinish,
    onStepFinish,
  }: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    maxRetries?: number;
    tools?: Record<string, any>;
    messages?: any[];
    systemPrompt?: string;
    prompt?: string;
    onFinish?: (data: any) => void;
    onStepFinish?: (data: any) => void;
  }) {
    await this.init(model);
    return aiStreamText({
      maxTokens,
      temperature,
      maxRetries,
      model: this.instance,
      tools: tools,
      maxSteps: 5,
      system: systemPrompt,
      prompt: prompt,
      messages: messages,
      onFinish,
      onStepFinish,
    });
  }

  async streamObject({
    model = BedrockModel.CLAUDE_3_HAIKU,
    temperature = 0,
    maxTokens = 2048,
    maxRetries = 3,
    messages = [],
    systemPrompt,
    prompt,
    schema,
    output,
    onFinish,
  }: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    maxRetries?: number;
    messages?: any[];
    systemPrompt?: string;
    prompt?: string;
    schema?: any;
    output?: 'object' | 'array';
    onFinish?: (data: any) => void;
  }) {
    await this.init(model);
    return aiStreamObject<any>({
      maxTokens,
      temperature,
      maxRetries,
      model: this.instance,
      system: systemPrompt,
      prompt: prompt,
      messages: messages,
      schema,
      output: output as any,
      onFinish,
    });
  }

  async generateText({
    model = BedrockModel.CLAUDE_3_HAIKU,
    temperature = 0,
    maxTokens = 2048,
    maxRetries = 3,
    tools = [],
    messages = [],
    systemPrompt,
    prompt,
    onStepFinish,
  }: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    maxRetries?: number;
    tools?: Record<string, any>;
    messages?: any[];
    systemPrompt?: string;
    prompt?: string;
    onFinish?: (data: any) => void;
    onStepFinish?: (data: any) => void;
  }) {
    await this.init(model);
    return aiGenerateText({
      maxTokens,
      temperature,
      maxRetries,
      model: this.instance,
      toolChoice: 'required',
      system: systemPrompt,
      prompt: prompt,
      messages: messages,
      tools: { ...tools },
      onStepFinish,
    });
  }

  async generateObject({
    model = BedrockModel.CLAUDE_3_HAIKU,
    temperature = 0,
    maxTokens = 2048,
    messages = [],
    systemPrompt,
    prompt,
    schema,
    output,
  }: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    maxRetries?: number;
    messages?: any[];
    systemPrompt?: string;
    prompt?: string;
    schema: any;
    output?: 'object' | 'array';
  }) {
    await this.init(model);
    return aiGenerateObject({
      maxTokens,
      temperature,
      model: this.instance,
      system: systemPrompt,
      prompt: prompt,
      messages: messages,
      schema,
      output: output as any,
    });
  }
}
