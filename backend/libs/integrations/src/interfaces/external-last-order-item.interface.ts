export interface ExternalLastOrderItem {
  id: string;
  externalOrderId: string;
  productId?: number;
  lineNum: number;
  itemName: string;
  itemCode: string;
  quantity: number;
  total: number;
}
