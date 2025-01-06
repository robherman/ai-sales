import { forwardRef, Module } from '@nestjs/common';
import { AiService } from './services/ai.service';
import { NlpService } from './services/nlp.service';
import { SentimentAnalysisService } from './services/sentiment-analysis.service';
import { BedrockAIService } from './providers/ai-sdk/bedrock';
import { AppConfigModule } from '../../config/src';
import { ToolsModule } from '../../tools/src';
import { LcChatbotAgentService } from './providers/langchain/lc-chatbot-agent';
import { LcChatbotService } from './providers/langchain/lc-chatbot';
import { LcEmbeddingService } from './providers/langchain/lc-embeddings';

@Module({
  imports: [AppConfigModule, forwardRef(() => ToolsModule)],
  providers: [
    AiService,
    NlpService,
    SentimentAnalysisService,
    BedrockAIService,
    LcChatbotAgentService,
    LcChatbotService,
    LcEmbeddingService,
  ],
  exports: [AiService],
})
export class AiCoreModule {}
