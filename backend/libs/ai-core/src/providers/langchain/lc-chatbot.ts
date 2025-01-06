import { ChatBedrockConverse, BedrockEmbeddings } from '@langchain/aws';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BedrockModel } from '../../const/models.const';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { BaseMessage } from '@langchain/core/messages';
import { ToolsService } from '../../../../tools/src';

@Injectable()
export class LcChatbotService {
  private instance: ChatBedrockConverse;
  private logger = new Logger(LcChatbotService.name);

  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => ToolsService))
    private toolsService: ToolsService,
  ) {}

  private async init(model?: string) {
    this.instance = new ChatBedrockConverse({
      model: model || BedrockModel.CLAUDE_3_HAIKU,
      temperature: 0,
      region: this.configService.get('ai.bedrock.region'),
      credentials: {
        accessKeyId: this.configService.get('ai.bedrock.accessKey')!,
        secretAccessKey: this.configService.get('ai.bedrock.secretKey')!,
      },
      // endpointUrl: "custom.amazonaws.com",
      // modelKwargs: {
      //   anthropic_version: "bedrock-2023-05-31",
      // },
    });
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
  }

  async generateText({
    messages,
    model = BedrockModel.CLAUDE_3_HAIKU,
    temperature = 0,
    maxTokens = 2048,
    tools = [],
    config,
  }: {
    messages: BaseMessage[];
    model?: string;
    temperature?: number;
    maxTokens?: number;
    tools?: Array<DynamicStructuredTool>;
    config?: any;
  }) {
    this.logger.log(`Generate LC Response`);
    await this.init(model);
    const llmRunner = this.instance;
    llmRunner.maxTokens = maxTokens;
    llmRunner.temperature = temperature;
    if (tools && tools.length > 0) {
      llmRunner.bindTools(tools);
    }
    const lcTools = this.toolsService.getLcTools();
    // const renderedTools = renderTextDescription([lcTools]);
    llmRunner.bindTools(lcTools, { tool_choice: 'buscar_productos' });
    const aiMessage = await llmRunner.invoke(messages, {
      ...config,
    });
    messages.push(aiMessage);
    let finalMessage = aiMessage;
    const toolsByName: Record<string, DynamicStructuredTool> = lcTools?.reduce(
      (acc: Record<string, DynamicStructuredTool>, curr) => {
        acc[curr.getName()] = curr;
        return acc;
      },
      {},
    );

    if (aiMessage.tool_calls && aiMessage.tool_calls?.length > 0) {
      this.logger.log(`Generate LC Tool Response`);
      for (const toolCall of aiMessage.tool_calls) {
        this.logger.log(`ToolCall`, { toolCall });
        const toolMessage = await this.tryExceptToolWrapper(
          toolsByName,
          toolCall,
        );
        this.logger.log(`Tool Resut`, { toolMessage });
        messages.push(toolMessage);
      }
      finalMessage = await llmRunner.invoke(messages);
    }

    return finalMessage;
  }

  private tryExceptToolWrapper = async (tools: any, toolCall: any) => {
    try {
      const selectedTool = tools[toolCall.name];
      const toolMessage = await selectedTool.invoke(toolCall.args);
      return toolMessage;
    } catch (e) {
      return `Calling tool with arguments:\n\n${JSON.stringify(
        toolCall,
      )}\n\nraised the following error:\n\n${e}`;
    }
  };

  async generateObject({
    model = BedrockModel.CLAUDE_3_HAIKU,
    temperature = 0,
    maxTokens = 2048,
    messages = [],
    schema,
    schemaName,
  }: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    messages?: any[];
    schema: any;
    schemaName: string;
  }) {
    this.logger.log(`Generate LC Response`);
    await this.init(model);
    this.instance.maxTokens = maxTokens;
    this.instance.temperature = temperature;
    const llmRunner = this.instance;
    const structuredLlm = llmRunner.withStructuredOutput(schema, {
      name: schemaName,
      method: 'json_mode',
      includeRaw: true,
    });

    const result = await structuredLlm.invoke(messages);
    return result.parsed;
  }
}
