export interface ExternalOrder {
  id: string;
  customerId: string;
  orderDate: Date;
  orderTotal: number;
  orderNumber?: number;
}
