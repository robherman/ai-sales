import { Injectable, Logger } from '@nestjs/common';
import { createRetrieverTool } from 'langchain/tools/retriever';
import { ProductSearchService } from '../../../product-search/src';

@Injectable()
export class ProductRetrieverTool {
  private logger = new Logger(ProductRetrieverTool.name);

  constructor(private productsSearchService: ProductSearchService) {}

  createLcTool() {
    const retrieverTool = createRetrieverTool(
      this.productsSearchService.getProductsRetriever(),
      {
        name: 'buscar_productos_base_conocimiento',
        description:
          'Obtener información detallada y actualizada de productos. Puede buscar productos por nombre, SKU, categoría.',
      },
    );
    return retrieverTool;
  }

  async run(params: any) {
    return;
  }
}
