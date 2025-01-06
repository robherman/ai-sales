import { Module } from '@nestjs/common';
import { SapAdapter } from './adapters/sap.adapter';
import { SalesforceAdapter } from './adapters/salesforce.adapter';
import { IntegrationsService } from './services/integrations.service';
import { ConfigModule } from '@nestjs/config';
import { CustomersModule } from '../../customers/src';
import { ProductsModule } from '../../products/src';
import { OrdersModule } from '../../orders/src';
import { SyncProcessor } from './services/sync-processor';
import { BullConfigModule } from '../../shared/src/bull/bull-config.module';
import { ChatModule } from '../../chat/src';
import { ConversationModule } from '../../conversation/src';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CustomersModule,
    ProductsModule,
    OrdersModule,
    BullConfigModule.forFeature(
      process.env.INTEGRATIONS_SYNC_QUEUE_NAME || 'sync',
    ),
    ChatModule,
    ConversationModule,
  ],
  providers: [
    SapAdapter,
    SalesforceAdapter,
    IntegrationsService,
    SyncProcessor,
  ],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
