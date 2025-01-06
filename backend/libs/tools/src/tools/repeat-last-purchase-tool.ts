import { Injectable, Logger } from '@nestjs/common';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { OrdersService } from '../../../orders/src';
import { ShoppingCartService } from '../../../shopping-cart/src';

@Injectable()
export class RepeatLastPurchaseTool {
  private logger = new Logger(RepeatLastPurchaseTool.name);

  constructor(
    private ordersService: OrdersService,
    private shoppingCartService: ShoppingCartService,
  ) {}

  private async execute(
    input: { customerId: string; cartId: string },
    config: any,
  ): Promise<any> {
    try {
      this.logger.debug(`Repeat last order`, { ...input });
      const lastOrder = await this.ordersService.findLastByCustomer(
        input.customerId,
      );
      if (!lastOrder || !lastOrder?.items?.length) {
        throw new Error(`Lo siento, tu último pedido no tiene items`);
      }

      const updatedCart = await this.shoppingCartService.repeatFromLastOrder(
        input.cartId,
        lastOrder.items,
      );
      return JSON.stringify({
        success: true,
        message: 'El pedido se ha creado correctamente',
        data: { shoppingCart: updatedCart },
      });
    } catch (error) {
      this.logger.error(
        `Error repeating last purchase: ${error.message}`,
        error.stack,
      );
      return JSON.stringify({
        error: 'Failed to repeat last purchase',
        message: error.message,
      });
    }
  }

  createLcTool() {
    return tool(this.run.bind(this), {
      name: 'repetir_ultimo_pedido_cliente',
      description:
        'Generar un carrito de compras con el último pedido del cliente.',
      schema: z.object({
        customerId: z
          .string()
          .describe(
            'Id de Cliente del que se quiere repetir el último pedido.',
          ),
        cartId: z.string().describe('Id del carrito de compras del cliente.'),
      }),
    });
  }

  async run(params: any, config?: any) {
    return this.execute(params, config);
  }
}
