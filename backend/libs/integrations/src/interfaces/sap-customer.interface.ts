export interface CustomerSap {
  id: string;
  CodSap: string;
  Razon_Social: string;
  Nombre_extranjero: string;
  Canal: string;
  Rut: string;
  Cellular: string;
  E_Mail: string;
  IndName: string;
  VendedorTerreno: string;
  U_Ejecutivo_Cobranza: string;
  U_Vendedor_Call: string;
  CondPago: string;
  LineaCredito: number;
  FchCreacionSN: string;
  Saldo: number;
  PrimVenta: string;
  UltVenta: string;
  Periodos3M: number;
  frozenFor: string;
  ListNum: number;
  ListName: string;
  City: string;
  Street: string;
  County: string;
  State: string;
  Dicom: string;
  EstatusGestion: string;
  '[Blq - Estacionales]': string;
  PeriodicidadVta: string;
  FrecuenciaCompra: string;
  ExMoroso: string;
  ContactFirstName?: string | null;
  ContactLastName?: string | null;
}