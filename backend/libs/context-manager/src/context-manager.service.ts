import { Injectable, Logger } from '@nestjs/common';
import { CustomersService } from '../../customers/src';
import { OrdersService } from '../../orders/src';
import { ContextInfo } from './interfaces/context.interface';
import { CustomerEntity } from '../../customers/src/entities/customer.entity';
import { OrderEntity } from '../../orders/src/entities/order.entity';
import { ProductsNoOrderService } from '../../products/src/services/products-no-order.service';
import { ChatService } from '../../chat/src';
import { SalesConfigService, UserConfigService } from '../../config/src';
import { ChatbotService } from '../../chatbot/src';
import { CompanyService } from '../../company/src';
import { ShoppingCartService } from '../../shopping-cart/src';

@Injectable()
export class ContextManagerService {
  private logger = new Logger(ContextManagerService.name);

  constructor(
    private customerService: CustomersService,
    private orderService: OrdersService,
    private productNotOrderedService: ProductsNoOrderService,
    private chatService: ChatService,
    private userSettingsService: UserConfigService,
    private salesConfigService: SalesConfigService,
    private chatbotService: ChatbotService,
    private companyService: CompanyService,
    private shoppingCartService: ShoppingCartService,
  ) {}

  async getContext(
    chatId: string,
    message: string,
    channel: string,
  ): Promise<ContextInfo> {
    try {
      this.logger.debug(`Building Context`, { chatId });
      const context = await this.buildContext(chatId, message);
      return context;
    } catch (error) {
      this.logger.error('Failed to get context', error, {
        chatId,
      });
      throw new Error('Failed to retrieve customer context');
    }
  }

  async getFormattedContext(chatId: string, message: string): Promise<string> {
    const context = await this.buildContext(chatId, message);
    return this.formatContext(context);
  }

  private async buildContext(
    chatId: string,
    message: string,
  ): Promise<ContextInfo> {
    const chat = await this.chatService.getChatById(chatId);
    const company = await this.companyService.getCompany(chat.companyId!);
    const customer = await this.customerService.findOneWithOrders(
      chat.customerId!,
    );
    // const userSettings = await this.userSettingsService.getUserSettings(
    //   chat.userId!,
    // );
    const salesSettings = await this.salesConfigService.getConfig();
    const chatbot = await this.chatbotService.findOneById(chat.chatbotId!);
    const [
      lastOrder,
      lastOrders,
      notOrderedProducts,
      customerStrategy,
      shoppingCart,
      averageOrderValue,
    ] = await Promise.all([
      this.orderService.getLastCustomerOrderWithItems(customer.id),
      this.orderService.getLastCustomerOrdersWithItems(customer.id, 5),
      this.productNotOrderedService.findAllByCustomer(customer.id),
      this.customerService.getCustomerStrategy(customer.id),
      this.shoppingCartService.findOrCreateCart(chat.id, customer.id),
      0,
    ]);

    const lastOrderItemsCategories = lastOrder?.items
      ?.map((i) => i.product?.category || '')
      .filter((c) => c)
      .join(', ');
    const lastOrderItemsSKUs = lastOrder?.items
      ?.map((i) => i.sku || '')
      .filter((c) => c)
      .join(', ');
    const shoppingCartSummary = shoppingCart?.items
      ?.map((i) => i.product?.category || i.name)
      .filter((c) => c)
      .join(', ');

    return {
      // Chatbot-specific settings
      chatbotName: chatbot.name,
      model: chatbot.additionalConfig.model,
      temperature: chatbot.additionalConfig.temperature,
      maxTokens: chatbot.additionalConfig.maxTokens,
      systemPromptId: chatbot.identityPromptTemplateId!,
      instructionsPromptId: chatbot.instructionsPromptTemplateId!,
      tone: chatbot.tone!,
      allowedLanguages: chatbot.languages,
      additionalConfig: chatbot.additionalConfig,

      // Company-specific settings
      companyName: company?.name || '',
      companyDescription: company?.description || '',
      companyPhone: company?.mobile || '',
      companyEmail: company?.email || '',
      productListFormat: company?.additionalConfig?.productListFormat,
      cartDetailsFormat: company?.additionalConfig?.cartDetailsFormat,
      forbiddenTopics: company?.additionalConfig?.forbiddenTopics,

      // Sales-config
      steps: salesSettings.steps,
      crossSellingDiscount: salesSettings.crossSellingDiscount,
      crossSellingDiscountApplied: false,

      // Context-specific information
      channel: chat.channel,
      timeOfDay: this.getTimeOfDay(),
      context: `Chat iniciado el ${new Date().toLocaleString()}`,

      // Customer
      customer: customer,
      customerName: customer.contactFirstName,
      isNewCustomer: customer.isFutureCustomer,
      isReturningCustomer: customer.isCurrentCustomer,
      isPastCustomer: customer.isPastCustomer,
      customerStrategy: customerStrategy,
      averageOrderValue: averageOrderValue,
      productsNotOrderedByCustomer: notOrderedProducts.map(
        ({ sku, productId, name, lastOrdered }) => ({
          sku,
          name,
          productId,
          lastOrdered,
        }),
      ),
      customerLastOrder: lastOrder,
      customerRecentOrders: lastOrders,
      customerLastOrderItemsCategories: lastOrderItemsCategories,
      customerLastOrderItemsSKUs: lastOrderItemsSKUs,
      shoppingCart: shoppingCart,
      shoppingCartLink: shoppingCart.wooCommerceCheckoutUrl,
      shoppingCartProductsSummary: shoppingCartSummary,
      shoppingCartTotal: shoppingCart?.Total,
      recommendedProducts: [],
      recommendedProductsList: [],

      // NLP
      isComplaint: this.detectComplaint(
        message,
        company?.additionalConfig?.complaintKeywords || [],
      ),
      isProductInquiry: this.detectProductInquiry(
        message,
        company?.additionalConfig?.productInquiryKeywords || [],
      ),

      message: message,
    };
  }

  private getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  private detectComplaint(message: string, keywords: string[]): boolean {
    return keywords.some((keyword) => message.toLowerCase().includes(keyword));
  }

  private detectProductInquiry(message: string, keywords: string[]): boolean {
    return keywords.some((keyword) => message.toLowerCase().includes(keyword));
  }

  private formatContext(context: ContextInfo): string {
    const {
      customer,
      customerLastOrder,
      customerRecentOrders,
      customerStrategy,
    } = context;

    const formatCustomer = (c?: CustomerEntity | null) => {
      if (!c) return 'N/A';
      return `
        Nombre: ${c.name}
        Contacto: ${c.contactLastName} ${c.contactLastName}
        Email: ${c.email || 'N/A'}
        Teléfono: ${c.mobile || 'N/A'}
        Status: ${c.status || 'N/A'}
        Dirección: ${c.fullAddress || 'N/A'}
        Última compra: ${c.lastPurchaseAt || 'N/A'}
        Frecuencia de compra: ${c.purchaseFrequency || 'N/A'},
        Día frecuente de compra: ${c.purchaseFrequencyDay || 'N/A'}
      `;
    };

    const formatOrder = (o?: OrderEntity | null) => {
      if (!o) return 'N/A';
      return `
        ID: ${o.id}
        Fecha: ${o.orderDate.toISOString()}
        Total: $${o.total}
        Status: ${o.status}
        Items: ${o.itemsCount}
      `;
    };

    const formatOrders = (orders: OrderEntity[]) => {
      return orders
        ?.map(
          (o) => `
        ID: ${o.id}
        Fecha: ${o.orderDate.toISOString()}
        Total: $${o.total}
      `,
        )
        .join('\n');
    };

    return `
    - Información actualizada del cliente
    ${formatCustomer(customer)}

    - Último pedido:
    ${formatOrder(customerLastOrder)}

    - Pedidos recientes:
    ${formatOrders(customerRecentOrders || [])}

    - Estrategia/Tipo de cliente: ${customerStrategy || 'N/A'}
    `;
  }
}
