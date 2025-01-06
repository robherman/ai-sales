import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { AppConfigModule } from '../../config/src';
import { CustomersModule } from '../../customers/src';
import { OrdersModule } from '../../orders/src';
import { ProductsModule } from '../../products/src';
import { AiCoreModule } from '../../ai-core/src';

@Module({
  imports: [
    CustomersModule,
    ProductsModule,
    OrdersModule,
    AppConfigModule,
    AiCoreModule,
  ],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
