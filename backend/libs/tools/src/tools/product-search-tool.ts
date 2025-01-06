import { Injectable, Logger } from '@nestjs/common';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { ProductEntity } from '../../../products/src/entities/product.entity';
import { ToolResponse } from '../interfaces/tool.interface';
import { ProductSearchService } from '../../../product-search/src';

@Injectable()
export class ProductSearchTool {
  private logger = new Logger(ProductSearchTool.name);

  constructor(private productSearchService: ProductSearchService) {}

  createLcTool() {
    const productSearch2 = tool(
      async ({ search, page, limit }) => {
        const result = await this.execute({ search, page, limit });
        return JSON.stringify(result);
      },
      {
        name: 'buscar_productos',
        description:
          'Obtener información detallada y actualizada de productos. Puede buscar productos por nombre, SKU, categoría. Devuelve una lista paginada con un número máximo de productos a mostrar. ',
        schema: z.object({
          search: z.string({
            description: 'Nombre, SKU, categoría de productos a buscar',
          }),
          page: z
            .number({ description: 'Número de página a mostrar' })
            .optional()
            .default(1),
          limit: z
            .number({ description: 'Cantidad de productos por página' })
            .optional()
            .default(5),
        }),
      },
    );
    return productSearch2;
  }

  async run(params: any) {
    return this.execute(params);
  }

  formatProduct(product: ProductEntity): string {
    return `- ${product.commonName} (SKU: ${product.sku}): Precio por ${product.unitLabel}: $${(Number(product.price) || 0).toFixed(2)} ($${(Number(product.packageUnitPrice) || 0).toFixed(2)} x ${product.packageLabel})`;
  }

  private async execute(input: {
    search: string;
    page?: number;
    limit?: number;
  }): Promise<
    ToolResponse<{
      productsSearchResult: ProductEntity[];
      formattedList?: Record<string, any>;
    }>
  > {
    try {
      this.logger.debug(`Running tool`, { input });
      const products = await this.productSearchService.searchProducts(
        input.search,
        input.limit,
      );
      this.logger.debug(`Products Search Result: ${products.length}`);
      return {
        success: true,
        data: {
          // formattedList: formattedProducts,
          productsSearchResult: products,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error searching products: ${error.message}`,
        error.stack,
      );
      return {
        error: 'Hubo un problema al buscar productos',
        success: false,
      };
    }
  }
}
