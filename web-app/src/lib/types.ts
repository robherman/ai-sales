export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string;
    }
>;

export interface Session {
  user: {
    id: string;
    email: string;
  };
  token: string;
}

export interface AuthResult {
  type: string;
  message: string;
}

export interface User extends Record<string, any> {
  id: string;
  email: string;
}

export enum ResultCode {
  InvalidCredentials = "INVALID_CREDENTIALS",
  InvalidSubmission = "INVALID_SUBMISSION",
  UserAlreadyExists = "USER_ALREADY_EXISTS",
  UnknownError = "UNKNOWN_ERROR",
  UserCreated = "USER_CREATED",
  UserLoggedIn = "USER_LOGGED_IN",
}

export type ChatMesageType =
  | "human"
  | "user"
  | "ai"
  | "assistant"
  | "generic"
  | "system"
  | "function"
  | "tool"
  | "remove";

export interface ChatMetadata extends Record<string, any> {
  duration?: number;
  sentiment?: string;
  score?: string;
  intent?: string;
}

export interface ChatMessageMetadata {
  isRead?: boolean;
  feedback?: {
    reaction?: string;
    comment?: string;
    score?: number;
    answerRelevanceScore?: number;
  };
  reactions?: string[];
  sentiment?: string;
  intent?: string;
  language?: string;
  displayStyle?: "default" | "highlighted" | "minimized";
  attachments?: {
    type: "image" | "file" | "link";
    url: string;
  }[];
  responseMetadata?: {
    finishReason?: string;
    modelId?: string;
    usage?: {
      completionTokens?: number;
      promptTokens?: number;
      totalTokens?: number;
      inputTokens?: number;
      outputTokens?: number;
    };
  };
}

export interface ChatMessage {
  id: string;
  content: string;
  role: ChatMesageType;
  toolResults?: any;
  metadata: ChatMessageMetadata & Record<string, any>;
  createdAt: Date;
}

export interface ChatStep {
  id: string;
  name: string;
  description: string;
}

export interface AppChat {
  id: string;
  userId?: string;
  customerId?: string;
  chatbotId?: string;
  companyId?: string;
  channel: string;
  title: string;
  status: "active" | "completed" | "archived";
  messages: Array<ChatMessage>;
  context?: any;
  formattedContext?: string;
  strategy?: string;
  steps?: Array<ChatStep>;
  currentStep?: ChatStep;
  nextStep?: ChatStep;
  greeting?: string;
  shoppingCart?: any;
  crossSellingDiscount?: number;
  maxHistoryCount?: number;
  additionalMetadata?: any;
  lastUserMessage?: ChatMessage;
  lastMessage?: ChatMessage;
  history?: Array<ChatMessage>;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatbotConfig {
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface Chatbot {
  id: string;
  name: string;
  identityPromptTemplateId?: string;
  instructionsPromptTemplateId?: string;
  tone?: string;
  languages: string[];
  channel?: string;
  additionalConfig: ChatbotConfig;
  isActive: boolean;
}

export interface Order {
  id: string;
  customerId?: string;
  total: number;
  status?: string;
  orderNumber: number;
  orderDate?: Date;
  customerName?: string;
  billingAddress?: string;
  shippingAddress?: string;
  discount?: number;
  externalId?: string;
  createdAt: Date;
  updatedAt?: Date;
  items: OrderItem[];
  itemsCount?: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  fullContactName?: string;
  email: string;
  mobile?: string;
  address?: any;
  billingAddress?: any;
  shippingAddress?: any;
  balance: number;
  lastOrderId?: string;
  purchaseFrequency?: string;
  purchaseFrequencyDay?: string;
  firstPurchaseAt?: string;
  lastPurchaseAt?: string;
  lastContactAt?: Date;
  createdAt?: Date;
  fullAddress?: string;
  externalSource?: string;
  isPastCustomer: boolean;
  isCurrentCustomer: boolean;
  isFutureCustomer: boolean;
  externalId?: string;
  externalMetadata?: Record<string, any>;
  status?: string;
  contactFirstName?: string;
  contactLastName?: string;
}

export interface Product {
  id: string;
  sku?: string;
  name: string;
  price?: number;
  specialPrice?: number;
  retailPrice?: number;
  manageStock: boolean;
  stock?: number;
  description?: string;
  longDescription?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  isOffer: boolean;
  isFeatured: boolean;
  shortName?: string;
  commonName?: string;
  slug?: string;
  externalId?: string;
  unitLabel?: string;
  packageUnit?: number;
  packageLabel?: string;
  packageUnitPrice?: number;
  imageUrl?: string;
}

export interface ProductNoOrder {
  id: string;
  productId: string;
  sku: string;
  name: string;
  customerId: string;
  lastOrdered: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
}

export interface ContextInfo {
  // Chatbot
  chatbotName: string;
  systemPromptId?: string;
  instructionsPromptId?: string;
  tone: string;
  allowedLanguages: string[];
  additionalConfig?: Record<string, any>;
  forbiddenTopics?: string[];

  // User
  companyName: string;
  companyDescription: string;
  productListFormat?: string;
  cartDetailsFormat?: string;

  // Sales
  steps?: string;
  crossSellingDiscount?: number;

  // Context
  channel: string;
  context: string;
  timeOfDay: string;
  customer?: Customer | null;
  customerLastOrder?: Order | null;
  customerRecentOrders?: Array<Order>;
  productsNotOrderedByCustomer?: Array<ProductNoOrder>;
  customerName: string;
  customerType: string;
  isNewCustomer: boolean;
  isReturningCustomer: boolean;
  isPastCustomer: boolean;
  customerStrategy: string;
  averageOrderValue: number;

  // Message
  message: string;
  isComplaint: boolean;
  isProductInquiry: boolean;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  website: string;
  email: string;
  mobile: string;
  additionalConfig: CompanySettings;
  isActive: boolean;
}

export interface CompanySettings {
  productListFormat?: string;
  cartDetailsFormat?: string;
  forbiddenTopics?: string[];
  complaintKeywords?: string[];
  productInquiryKeywords: string[];
}

export interface SalesStep {
  id: string;
  name: string;
  description: string;
}

export interface SalesConfigSettings {
  steps?: SalesStep[];
  crossSellingDiscount?: number;
  specialDiscount?: number;
}

export interface PromptTemplate extends Record<string, any> {}
