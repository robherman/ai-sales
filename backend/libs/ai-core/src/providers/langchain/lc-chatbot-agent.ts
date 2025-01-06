import { ChatBedrockConverse } from '@langchain/aws';
import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ToolsService } from '../../../../tools/src';
import {
  CompiledStateGraph,
  MessagesAnnotation,
  StateGraph,
} from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { AIMessage, BaseMessage } from '@langchain/core/messages';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { BedrockModel } from '../../const/models.const';
import { ConfigService } from '@nestjs/config';
import { Runnable } from '@langchain/core/runnables';

@Injectable()
export class LcChatbotAgentService implements OnModuleInit {
  private chatModel: ChatBedrockConverse;
  private chatModelWithTools: Runnable;
  private agent: any;
  private logger = new Logger(LcChatbotAgentService.name);

  constructor(
    @Inject(forwardRef(() => ToolsService))
    private toolsService: ToolsService,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    this.chatModel = new ChatBedrockConverse({
      model: BedrockModel.CLAUDE_3_HAIKU,
      temperature: 0,
      maxTokens: 2048,
      region: this.configService.get('ai.bedrock.region'),
      credentials: {
        accessKeyId: this.configService.get('ai.bedrock.accessKey')!,
        secretAccessKey: this.configService.get('ai.bedrock.secretKey')!,
      },
    });
  }

  private initAgent() {
    this.logger.log(`Init AI Agent `);
    const tools = this.toolsService.getLcTools();
    const toolNode = new ToolNode(tools);
    this.chatModelWithTools = this.chatModel.bindTools(tools);
    const workflow = new StateGraph(MessagesAnnotation)
      .addNode('agent', this.callModel.bind(this))
      .addEdge('__start__', 'agent')
      .addNode('tools', toolNode)
      .addEdge('tools', 'agent')
      .addConditionalEdges('agent', this.shouldContinue.bind(this));

    this.agent = workflow.compile();
  }

  private shouldContinue({ messages }: typeof MessagesAnnotation.State) {
    const lastMessage: any = messages[messages.length - 1];
    if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
      this.logger.debug(
        `Invoking Tools`,
        JSON.stringify(lastMessage.tool_calls),
      );
      return 'tools';
    }
    this.logger.log(`Ending workflow`);
    return '__end__';
  }

  private async callModel(state: typeof MessagesAnnotation.State) {
    this.logger.log(`Invoking LLM`);
    const response = await this.chatModelWithTools.invoke(state.messages);
    return { messages: [response] };
  }

  private async execute({
    messages,
    config,
  }: {
    messages: BaseMessage[];
    config?: any;
  }) {
    this.logger.log(`Execute Agent`);
    const finalState = await this.agent.invoke(
      {
        messages,
      },
      { configurable: { ...config } },
    );
    const finalMessage = finalState.messages[finalState.messages.length - 1];
    return finalMessage as AIMessage;
  }

  private async stream({
    messages,
    config,
  }: {
    messages: BaseMessage[];
    config?: any;
  }) {
    this.logger.log(`Stream Agent`);
    const events = await this.agent.streamEvents(
      {
        messages,
      },
      { version: 'v2' },
      { configurable: { ...config } },
    );
    return events;
  }

  async generateResponse({
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
    this.logger.log(`Generate Agent Response`);
    this.chatModel.temperature = temperature;
    this.chatModel.maxTokens = maxTokens;
    this.chatModel.model = model;
    this.initAgent();

    const finalMessage = await this.execute({ messages, config });
    return finalMessage;
  }

  async streamResponse({
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
    this.logger.log(`Generate Agent Response`);
    this.chatModel.temperature = temperature;
    this.chatModel.maxTokens = maxTokens;
    this.chatModel.model = model;
    this.initAgent();

    const finalMessage = await this.stream({ messages, config });
    return finalMessage;
  }
}
