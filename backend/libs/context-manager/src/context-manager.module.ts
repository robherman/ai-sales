import { Module } from '@nestjs/common';
import { ContextManagerService } from './context-manager.service';
import { CustomersModule } from '../../customers/src';
import { OrdersModule } from '../../orders/src';
import { ProductsModule } from '../../products/src';
import { AppConfigModule } from '../../config/src';
import { ChatModule } from '../../chat/src';
import { ChatbotModule } from '../../chatbot/src';
import { CompanyModule } from '../../company/src';
import { ShoppingCartModule } from '../../shopping-cart/src';

@Module({
  imports: [
    CustomersModule,
    OrdersModule,
    ProductsModule,
    AppConfigModule,
    ChatModule,
    ChatbotModule,
    CompanyModule,
    ShoppingCartModule,
  ],
  providers: [ContextManagerService],
  exports: [ContextManagerService],
})
export class ContextManagerModule {}
