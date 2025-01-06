import { Injectable, Logger } from '@nestjs/common';
import { ShoppingCartService } from '../../../shopping-cart/src';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

@Injectable()
export class ConfirmCartTool {
  private logger = new Logger(ConfirmCartTool.name);

  constructor(private shoppingCartService: ShoppingCartService) {}

  createLcTool() {
    return tool(
      async ({ cartId }) => {
        return this.execute({ cartId });
      },
      {
        name: 'confirmar_carrito',
        description:
          'Confirmar el carrito de compras de un cliente y generar link para finalizar la compra en el sitio web.',
        schema: z.object({
          cartId: z.string({
            description: 'ID del carrito de comrpas del cliente',
          }),
        }),
      },
    );
  }

  async run(params: any) {
    return this.execute(params);
  }

  private async execute({ cartId }: { cartId: string }): Promise<string> {
    try {
      this.logger.debug(`Running tool `, { cartId });
      const result = await this.shoppingCartService.confirmCart(cartId);
      return JSON.stringify({
        success: true,
        data: {
          shoppingCart: result,
          shoppingCartLink: result.wooCommerceCheckoutUrl,
        },
      });
    } catch (error) {
      this.logger.error(`Error confirming cart: ${error.message}`, error.stack);
      return JSON.stringify({
        error: 'Failed to confirm cart',
        message: error.message,
      });
    }
  }
}
