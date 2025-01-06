import { Module } from '@nestjs/common';
import { AiCoreModule } from '../../ai-core/src';
import { ToolsModule } from '../../tools/src';
import { ContextManagerModule } from '../../context-manager/src';
import { CustomersModule } from '../../customers/src';
import { ChatModule } from '../../chat/src';
import { ChatbotModule } from '../../chatbot/src';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationSettingEntity } from './entities/conversation-setting.entity';
import { ConversationFlowService } from './services/conversation-flow.service';
import { ConversationService } from './services/conversation.service';
import { GreetingEntity } from './entities/greeting.entity';
import { GreetingsService } from './services/greetings.service';
import { ConversationSettingsService } from './services/conversation-settings.service';
import { ConversationChannelIntegrationService } from './services/channel-integration.service';
import { AppConfigModule } from '../../config/src';
import { PromptsModule } from '../../prompts/src';

@Module({
  imports: [
    AiCoreModule,
    ToolsModule,
    ContextManagerModule,
    CustomersModule,
    ChatModule,
    ChatbotModule,
    TypeOrmModule.forFeature([ConversationSettingEntity, GreetingEntity]),
    AppConfigModule,
    PromptsModule,
  ],
  providers: [
    ConversationService,
    ConversationFlowService,
    GreetingsService,
    ConversationSettingsService,
    ConversationChannelIntegrationService,
  ],
  exports: [
    ConversationService,
    ConversationSettingsService,
    GreetingsService,
    ConversationChannelIntegrationService,
  ],
})
export class ConversationModule {}
