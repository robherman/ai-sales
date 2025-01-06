import { Module } from '@nestjs/common';
import { ProductSearchService } from './product-search.service';
import { AppConfigModule } from '../../config/src';
import { ProductsModule } from '../../products/src';
import { AiCoreModule } from '../../ai-core/src';

@Module({
  imports: [AppConfigModule, ProductsModule, AiCoreModule],
  providers: [ProductSearchService],
  exports: [ProductSearchService],
})
export class ProductSearchModule {}
