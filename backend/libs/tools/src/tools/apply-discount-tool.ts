import { Injectable, Logger } from '@nestjs/common';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { ShoppingCartService } from '../../../shopping-cart/src';

@Injectable()
export class ApplyDiscountTool {
  private logger = new Logger(ApplyDiscountTool.name);

  constructor(private shoppingCartService: ShoppingCartService) {}

  private async execute(
    input: { cartId: string; discountAmount: number },
    config?: any,
  ): Promise<any> {
    try {
      const shoppingCart = await this.shoppingCartService.applyDiscount(
        input.cartId,
        input.discountAmount,
      );
      return JSON.stringify({ success: true, data: { shoppingCart } });
    } catch (error) {
      this.logger.error(
        `Error applying discount: ${error.message}`,
        error.stack,
      );
      return JSON.stringify({
        error: 'Failed to apply discount',
        message: error.message,
      });
    }
  }

  createLcTool() {
    return tool(this.run.bind(this), {
      name: 'aplicar_descuento_carrito',
      description: 'Aplicar descuento al carrito de compras del cliente',
      schema: z.object({
        cartId: z.string().describe('Id de carrito del cliente.'),
        discountAmount: z.number().describe('Valor del descuento a aplicar.'),
      }),
    });
  }

  async run(params: any, config?: any) {
    return this.execute(params, config);
  }
}
