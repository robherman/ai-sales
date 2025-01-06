export interface ExternalLastOrder {
  id: string;
  customerId: string;
  orderDate: Date;
  orderTotal: number;
  orderNumber?: number;
}
