export interface ExternalCustomer {
  id: string;
  source: 'sap' | 'salesforce';
  name: string;
  email: string;
  businessName?: string;
  mobile?: string;
  docNumber?: string;
  address?: {
    state: string | null;
    city: string | null;
    street: string | null;
    county: string | null;
  };
  channel?: string;
  lastPurchaseAt?: string | null;
  firstPurchaseAt?: string | null;
  paymentCondition?: string;
  balance?: number;
  purchaseFrequency?: string | null;
  purchaseFrequencyDay?: string | null;
  frequencyFull?: string | null;
  frequencyPurchaseFull?: string | null;
  frequency2024?: string | null;
  frequencyPurchase2024?: string | null;
  status?: string | null;
  aditionalData?: Record<string, any>;
  createdAt?: Date;
  contactFirstName?: string | null;
  contactLastName?: string | null;
}
