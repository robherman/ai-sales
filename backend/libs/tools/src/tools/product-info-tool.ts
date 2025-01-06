import { Injectable, Logger } from '@nestjs/common';
import { ProductsService } from '../../../products/src';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

@Injectable()
export class ProductInfoTool {
  private logger = new Logger(ProductInfoTool.name);

  constructor(private productService: ProductsService) {}

  createLcTool() {
    const productInfo = tool(
      async ({ search }) => {
        return this.execute({ search });
      },
      {
        name: 'obtener_detalle_producto',
        description:
          'Obtener información detallada y actualizada de un producto del catálogo. Puede buscar SKU o nombre de producto.',
        schema: z.object({
          search: z.string({
            description: 'Nombre o SKU de producto',
          }),
        }),
      },
    );
    return productInfo;
  }

  async run(params: any) {
    return this.execute(params);
  }

  private async execute(input: { search: string }): Promise<string> {
    try {
      this.logger.log(`Running tool`, { input });
      const products = await this.productService.search(input.search, 1, 1);
      if (products?.length > 0) {
        return JSON.stringify({
          success: true,
          data: { productInfo: products[0] },
        });
      }
      throw new Error(`Product search: ${input.search} not found`);
    } catch (error) {
      this.logger.error(`Failed to find product`, error);
      return JSON.stringify({
        success: false,
        error: `No se pudo obtener información del producto ${input.search}`,
      });
    }
  }
}
