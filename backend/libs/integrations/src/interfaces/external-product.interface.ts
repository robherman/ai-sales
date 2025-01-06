export interface ExternalProduct {
  id: string;
  name: string;
  code?: string | null;
  category?: string | null;
  subcategory?: string | null;
  family3?: string | null;
  shortName?: string | null;
  commonName?: string | null;
  price?: number;
  unitLabel?: string | null;
  packageUnit?: number | null;
  packageLabel?: string | null;
  packageUnitPrice?: number | null;
  metadata?: {
    sap?: {
      sellItem?: string;
      frozenFor?: string;
    };
  };
}
