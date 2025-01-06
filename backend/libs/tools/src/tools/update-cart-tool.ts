import { Injectable, Logger } from '@nestjs/common';
import { ShoppingCartService } from '../../../shopping-cart/src';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

@Injectable()
export class UpdateCartTool {
  private logger = new Logger(UpdateCartTool.name);

  constructor(private shoppingCartService: ShoppingCartService) {}

  createLcTool() {
    return tool(
      async ({ cartId, action, sku, packageQuantity }) => {
        return this.execute({ cartId, action, sku, packageQuantity });
      },
      {
        name: 'actualizar_carrito',
        description:
          'Actualizar el carrito de compras de un cliente. Agrega, actualiza, elimina productos del carrito. ',
        schema: z.object({
          cartId: z.string({
            description: 'ID del carrito de comrpas del cliente',
          }),
          sku: z.string({
            description: 'SKU del producto a agregar, actualizar o eliminar',
          }),
          action: z.enum(['add', 'update', 'delete'], {
            description:
              'Acción a realizar en el carrito: agregar (add), actualizar (update) o eliminar (delete) el producto',
          }),
          packageQuantity: z
            .number()
            .int()
            .positive()
            .describe(
              'Cantidad de paquetes del producto (cajas, bidones, bolsas). Requerido para agregar o actualizar, ignorado para eliminar.',
            ),
        }),
      },
    );
  }

  async run(params: any) {
    return this.execute(params);
  }

  private async execute({
    cartId,
    sku,
    packageQuantity,
    action,
  }: any): Promise<string> {
    try {
      const result = await this.shoppingCartService.updateCart(cartId, {
        sku,
        packageQuantity,
        action,
      });
      return JSON.stringify({
        success: true,
        data: {
          shoppingCart: result,
        },
      });
    } catch (error) {
      this.logger.error(`Error updating cart: ${error.message}`, error.stack);
      return JSON.stringify({
        error: 'Failed to update cart',
        message: error.message,
      });
    }
  }
}
