import { CustomerEntity } from '../../../customers/src/entities/customer.entity';
import { OrderEntity } from '../../../orders/src/entities/order.entity';
import { ProductNoOrderEntity } from '../../../products/src/entities/product-no-order.entity';
import { ProductEntity } from '../../../products/src/entities/product.entity';
import { ShoppingCartEntity } from '../../../shopping-cart/src/entities/shopping-cart.entity';

export interface ContextInfo {
  // Chatbot
  chatbotName: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPromptId?: string;
  instructionsPromptId?: string;
  tone: string;
  allowedLanguages: string[];
  additionalConfig?: Record<string, any>;
  forbiddenTopics?: string[];

  // User
  companyName: string;
  companyDescription: string;
  companyPhone?: string;
  companyEmail?: string;
  productListFormat?: string;
  cartDetailsFormat?: string;

  // Sales
  steps?: string;
  crossSellingDiscount?: number;
  crossSellingDiscountApplied?: boolean;

  // Context
  channel: string;
  context: string;
  timeOfDay: string;
  customer?: CustomerEntity | null;
  customerName?: string;
  customerLastOrder?: OrderEntity | null;
  customerLastOrderItemsCategories?: string;
  customerLastOrderItemsSKUs?: string;
  customerRecentOrders?: Array<OrderEntity>;
  productsNotOrderedByCustomer?: Array<Partial<ProductNoOrderEntity>>;
  isNewCustomer: boolean;
  isReturningCustomer: boolean;
  isPastCustomer: boolean;
  customerStrategy: string;
  averageOrderValue: number;

  // Shopping Cart
  shoppingCart?: ShoppingCartEntity | null;
  shoppingCartLink?: string;
  shoppingCartProductsSummary?: string;
  shoppingCartTotal?: number;

  recommendedProducts?: Array<ProductEntity>;
  recommendedProductsList?: Array<any>;

  // Message
  message: string;
  isComplaint: boolean;
  isProductInquiry: boolean;
}
