import { Injectable, Logger } from '@nestjs/common';
import { CustomersService } from '../../customers/src';
import { ProductsService } from '../../products/src';
import { OrdersService } from '../../orders/src';
import { ProductsNoOrderService } from '../../products/src/services/products-no-order.service';
import { AiService } from '../../ai-core/src';
import { BedrockModel } from '../../ai-core/src/const/models.const';
import { ProductEntity } from '../../products/src/entities/product.entity';
import { ProductNoOrderEntity } from '../../products/src/entities/product-no-order.entity';
import { OrderItemEntity } from '../../orders/src/entities/order-item.entity';
import { CustomerEntity } from '../../customers/src/entities/customer.entity';
import { OrderEntity } from '../../orders/src/entities/order.entity';
import { z } from 'zod';

interface RecommendationContext {
  customer: Partial<CustomerEntity>;
  purchasedProducts: Array<Partial<Record<string, any>>>;
  nonOrderedProducts: Array<Partial<Record<string, any>>>;
  allProducts: Array<Partial<ProductEntity>>;
}

@Injectable()
export class RecommendationsService {
  private logger = new Logger(RecommendationsService.name);

  constructor(
    private customerService: CustomersService,
    private ordersService: OrdersService,
    private productService: ProductsService,
    private productNoOrderService: ProductsNoOrderService,
    private aiService: AiService,
  ) {}

  async getRecommendations(
    customerId: string,
    limit: number = 5,
  ): Promise<ProductEntity[]> {
    try {
      const context = await this.buildRecommendationContext(customerId);
      const recommendedProductIds = await this.generateAIRecommendations(
        context,
        limit,
      );
      return this.fetchRecommendedProducts(recommendedProductIds, limit);
    } catch (error) {
      this.logger.error(
        `Error generating recommendations for customer ${customerId}`,
        error.stack,
      );
      throw new Error('Failed to generate recommendations');
    }
  }

  private async fetchRecommendedProducts(
    productIds: string[],
    limit: number,
  ): Promise<ProductEntity[]> {
    return this.productService.findRecommendations(productIds, limit);
  }

  private async buildRecommendationContext(
    customerId: string,
  ): Promise<RecommendationContext> {
    const [customer, purchaseHistory, productCatalog, productNoOrder] =
      await Promise.all([
        this.customerService.findOne(customerId),
        this.ordersService.getLastCustomerOrdersWithItems(customerId, 10),
        this.productService.findAll({ limit: 250 }),
        this.productNoOrderService.findAllByCustomer(customerId),
      ]);

    const productMap = new Map(productCatalog.products.map((p) => [p.id, p]));

    return {
      customer: { id: customer.id, name: customer.name },
      purchasedProducts: this.mapOrdersToProducts(purchaseHistory, productMap),
      nonOrderedProducts: this.mapProductsToContext(productNoOrder, productMap),
      allProducts: this.mapProductsToContext(
        productCatalog.products,
        productMap,
      ),
    };
  }

  private mapOrdersToProducts(
    orders: OrderEntity[],
    productMap: Map<string, any>,
  ): Array<Partial<OrderItemEntity>> {
    return orders.flatMap((order) =>
      order.items.map((item) => ({
        productId: item.productId,
        sku: item.sku,
        name: item.name,
        category: item.productId && productMap.get(item.productId)?.category,
        orderedAt: order.orderDate,
        quantity: item.quantity,
      })),
    );
  }

  private mapProductsToContext(
    products: Array<ProductNoOrderEntity | ProductEntity>,
    productMap: Map<string, any>,
  ): Array<Partial<Record<string, any>>> {
    return products.map((product) => ({
      productId: product.id,
      sku: product.sku,
      name: product.name,
      category: productMap.get(product.id)?.category,
      lastOrderedAt: 'lastOrder' in product && product.lastOrder,
    }));
  }

  private async generateAIRecommendations(
    context: RecommendationContext,
    limit: number,
  ): Promise<string[]> {
    const systemPrompt = `Como experto en recomendaciones de productos, analiza la información del cliente, el historial de compras y el catálogo de productos proporcionados.
Genera una lista de ${limit} productos que podrían interesar al cliente.

Reglas:
- Recomienda productos similares del catálogo de la misma categoría o categorías relacionadas, por ejemplo "papas" y "aceite".
- Asegúrate de que todos los IDs de productos recomendados existan en el catálogo de productos proporcionado.
- Siempre incluye una recomendación de aceite si el cliente ha comprado por ejemplo "papas".
`;

    const humanPrompt = `<context>
Información de cliente:
${JSON.stringify(context.customer, null, 2)}

Productos comprados por el cliente:
${JSON.stringify(context.purchasedProducts, null, 2)}

Productos que el cliente ha dejado de comprar:
${JSON.stringify(context.nonOrderedProducts, null, 2)}

Catálogo de productos:
${JSON.stringify(context.allProducts, null, 2)}
    </context>`;

    const aiResponse = await this.aiService.generateObjectResponse({
      model: BedrockModel.CLAUDE_3_HAIKU,
      temperature: 0.2,
      maxTokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: humanPrompt },
      ],
      schema: z.object({
        recommended: z
          .array(
            z.object({
              id: z.string().describe('Id del producto recomendado'),
              name: z.string().describe('Nombre del producto recomendado'),
              reasoning: z
                .string()
                .describe(
                  'Resume tu razonamiento  de selección de este producto. ',
                ),
            }),
          )
          .describe(`Lista de productos recomendados`),
      }),
    });

    return this.parseAIResponse(aiResponse.content);
  }

  private parseAIResponse(content: any): string[] {
    try {
      const { recommended } = content;
      this.logger.debug(`recommended ids`, recommended);
      return recommended.map((r: any) => r.id);
    } catch (error) {
      this.logger.error('Failed to parse AI recommendations', error);
      throw new Error('Failed to generate valid recommendations');
    }
  }
}
