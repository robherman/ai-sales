import { Injectable, Logger } from '@nestjs/common';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { ShoppingCartService } from '../../../shopping-cart/src';

@Injectable()
export class ClearCartTool {
  private logger = new Logger(ClearCartTool.name);

  constructor(private shoppingCartService: ShoppingCartService) {}

  createLcTool() {
    return tool(
      async ({ cartId }) => {
        try {
          const clearedCart = await this.shoppingCartService.clearCart(cartId);
          return JSON.stringify({
            message: 'El carrito ha sido limpiado',
            success: true,
          });
        } catch (error) {
          this.logger.error(
            `Error clearing cart: ${error.message}`,
            error.stack,
          );
          return JSON.stringify({
            error: 'Failed to clear cart',
            message: error.message,
          });
        }
      },
      {
        name: 'limpiar_carrito',
        description:
          'Limpiar el carrito de compras del cliente, eliminando todos los items.',
        schema: z.object({
          cartId: z.string().describe('ID del carrito de compras del cliente'),
        }),
      },
    );
  }
}
