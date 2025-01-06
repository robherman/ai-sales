export interface AddOrderItemDto {
  externalId: string;
  sku?: string;
  name?: string;
  quantity?: number;
  orderId: string;
}
