import { Module } from '@nestjs/common';
import { ToolsService } from './services/tools.service';
import { ConfigModule } from '@nestjs/config';
import { CustomersModule } from '../../customers/src';
import { OrdersModule } from '../../orders/src';
import { ProductsModule } from '../../products/src';
import { RecommendationsModule } from '../../recommendations/src';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToolEntity } from './entities/tool.entity';
import { ShoppingCartModule } from '../../shopping-cart/src';
import { ProductSearchTool } from './tools/product-search-tool';
import { ProductInfoTool } from './tools/product-info-tool';
import { ApplyDiscountTool } from './tools/apply-discount-tool';
import { ClearCartTool } from './tools/clear-cart-tool';
import { ConfirmCartTool } from './tools/confirm-cart-tool';
import { RecommendationsTool } from './tools/recommendations-tool';
import { RepeatLastPurchaseTool } from './tools/repeat-last-purchase-tool';
import { UpdateCartTool } from './tools/update-cart-tool';
import { ProductSearchModule } from '../../product-search/src';
import { ProductRetrieverTool } from './tools/product-retriever-tool';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forFeature([ToolEntity]),
    CustomersModule,
    ProductsModule,
    OrdersModule,
    RecommendationsModule,
    ShoppingCartModule,
    ProductSearchModule,
  ],
  providers: [
    ToolsService,
    ProductSearchTool,
    ProductInfoTool,
    ApplyDiscountTool,
    ClearCartTool,
    ConfirmCartTool,
    RecommendationsTool,
    RepeatLastPurchaseTool,
    UpdateCartTool,
    ProductRetrieverTool,
  ],
  exports: [ToolsService],
})
export class ToolsModule {}
