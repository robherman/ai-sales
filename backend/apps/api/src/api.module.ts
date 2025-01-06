import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from '@lib/shared/database/database.module';
import { ChatModule } from '@lib/chat';
import { CustomersModule } from '@lib/customers';
import { OrdersModule } from '@lib/orders';
import { ProductsModule } from '@lib/products';
import { UsersModule } from '@lib/users';
import { AuthModule } from '@lib/auth';
import { HealthController } from './controllers/health.controller';
import { ProfileController } from './controllers/v1/profile.controller';
import { ChatController } from './controllers/v1/chat.controller';
import { AuthController } from './controllers/auth.controller';
import { CustomersController } from './controllers/v1/customers.controller';
import { OrdersController } from './controllers/v1/orders.controller';
import { ProductsController } from './controllers/v1/products.controller';
import { ChatbotController } from './controllers/v1/chatbot.controller';
import { ToolsModule } from '../../../libs/tools/src';
import { VersionController } from './controllers/version.controller';
import { IntegrationsController } from './controllers/v1/integrations.controller';
import { IntegrationsModule } from '../../../libs/integrations/src';
import { BullConfigModule } from '../../../libs/shared/src/bull/bull-config.module';
import { ConfigController } from './controllers/v1/config.controller';
import { ConversationController } from './controllers/v1/conversation.controller';
import { AiCoreModule } from '../../../libs/ai-core/src';
import { ChatbotModule } from '../../../libs/chatbot/src';
import { ContextManagerModule } from '../../../libs/context-manager/src';
import { ConversationModule } from '../../../libs/conversation/src';
import { ProductsNoOrderController } from './controllers/v1/product-no-order.controller';
import { RecommendationsController } from './controllers/v1/recommendations.controller ';
import { RecommendationsModule } from '../../../libs/recommendations/src';
import { CorrelationIdMiddleware } from './middleware/correlation-id.middleware';
import { PromptsModule } from '../../../libs/prompts/src';
import { CompanyModule } from '../../../libs/company/src';
import { AppConfigModule } from '../../../libs/config/src';
import { PromptsController } from './controllers/v1/prompts.controller';
import { ConversationSettingsController } from './controllers/v1/conversation-settings.controller';
import { ShoppingCartModule } from '../../../libs/shopping-cart/src';
import { ShoppingCartController } from './controllers/v1/shopping-cart.controller';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    DatabaseModule,
    BullConfigModule.forRoot(),
    AppConfigModule,
    AiCoreModule,
    AuthModule,
    ChatModule,
    ChatbotModule,
    ContextManagerModule,
    CustomersModule,
    IntegrationsModule,
    OrdersModule,
    ProductsModule,
    ToolsModule,
    UsersModule,
    ConversationModule,
    RecommendationsModule,
    PromptsModule,
    CompanyModule,
    ShoppingCartModule,
  ],
  controllers: [
    HealthController,
    VersionController,
    AuthController,
    ProfileController,
    // v1
    ChatController,
    ChatbotController,
    ConfigController,
    ConversationSettingsController,
    ConversationController,
    CustomersController,
    IntegrationsController,
    OrdersController,
    ProductsNoOrderController,
    ProductsController,
    PromptsController,
    RecommendationsController,
    ShoppingCartController,
  ],
  providers: [],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
