import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as MsSQL from 'mssql';
import { ExternalCustomer } from '../interfaces/external-customer.interface';
import { ExternalProduct } from '../interfaces/external-product.interface';
import { ExternalOrder } from '../interfaces/external-order.interface';
import { ExternalCustomerNonOrderProduct } from '../interfaces/external-customer-non-ordered-product.interface';
import { CustomerSap } from '../interfaces/sap-customer.interface';
import { ExternalLastOrder } from '../interfaces/external-last-order.interface';
import { ExternalLastOrderItem } from '../interfaces/external-last-order-item.interface';

@Injectable()
export class SapAdapter implements OnModuleInit, OnModuleDestroy {
  private logger: Logger = new Logger(SapAdapter.name);
  private msSqlPool: MsSQL.ConnectionPool;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.initDb();
  }

  async onModuleDestroy() {
    await this.closeDb();
  }

  private async initDb() {
    try {
      const config = {
        user: this.configService.get('SAP_DB_USER'),
        password: this.configService.get('SAP_DB_PASS'),
        database: this.configService.get('SAP_DB_NAME'),
        server: this.configService.get('SAP_DB_HOST'),
        pool: {
          max: 10,
          min: 0,
          idleTimeoutMillis: 30000,
        },
        options: {
          encrypt: true,
          trustServerCertificate: true,
          connectionTimeout: 30000,
          requestTimeout: 120000,
        },
      };
      this.msSqlPool = new MsSQL.ConnectionPool(config);
      await this.msSqlPool.connect();
      this.logger.log(`Database connected`);
    } catch (err) {
      this.logger.error(`Connection failed`, err);
      if (err instanceof Error) {
        this.logger.error(`Error name: ${err.name}, message: ${err.message}`);
        if ('code' in err) {
          this.logger.error(`Error code: ${(err as any).code}`);
        }
      }
    }
  }

  private async closeDb() {
    try {
      await this.msSqlPool.close();
      this.logger.log('Database connection closed');
    } catch (err) {
      this.logger.error('Error closing database connection', err);
    }
  }

  async query<T>(query: string, params?: Record<string, any>): Promise<T[]> {
    try {
      const request = new MsSQL.Request(this.msSqlPool);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          request.input(key, value);
        });
      }

      const result = await request.query<T>(query);
      return result.recordset;
    } catch (err) {
      this.logger.error(`Query execution failed: ${query}`, err);
      throw err;
    }
  }

  async countCustomers(filter?: any, limit = 50, offset = 0) {
    this.logger.log(`Count customers`);
    try {
      const result = await this.query<{ total: number }[]>(
        `SELECT COUNT(*) total
      FROM [ODBC MAESTRO SN-C GLOBALFROZEN_SALES_BOT_SAMPLE];
          ;`,
      );
      return result[0];
    } catch (error) {
      this.logger.error(`Failed`, error);
      throw new Error(`Failed to retrieve customers: ${error.message}`);
    }
  }

  async findCustomers(filter?: any, limit = 50, offset = 0) {
    this.logger.log(`Find customers`);
    try {
      const result = await this.query<CustomerSap>(
        `SELECT x.*
FROM [ODBC MAESTRO SN-C GLOBALFROZEN_SALES_BOT_SAMPLE] x;`,
        //   `;WITH Results_CTE AS
        // (
        //     SELECT
        //         *,
        //         ROW_NUMBER() OVER (ORDER BY CodSap) AS RowNum
        //     FROM [ODBC MAESTRO SN-C GLOBALFROZEN_SALES_BOT_SAMPLE]
        // )
        // SELECT *
        // FROM Results_CTE
        // WHERE RowNum >= ${offset} AND RowNum < ${offset + limit};`,
      );
      // const total = await this.countCustomers();
      const data: ExternalCustomer[] = result.map((c: any) => ({
        id: c.CodSap,
        source: 'sap',
        name: c.Razon_Social,
        email: c.E_Mail,
        mobile: c.Cellular,
        channel: c.Canal,
        paymentCondition: c.CondPago,
        balance: c.Saldo,
        firstPurchaseAt: c.PrimVenta || '',
        lastPurchaseAt: c.UltVenta || '',
        address: {
          city: c.City,
          street: c.Street,
          county: c.County,
          state: c.State,
        },
        purchaseFrequency: c.FrecuenciaCompra_full,
        purchaseFrequencyDay: c.PeriodicidadVta,
        frequencyFull: c.Frecuencia_Full,
        frequency2024: c.Frecuencia_2024,
        frequencyPurchase2024: c.FrecuenciaCompra_2024,
        frequencyPurchaseFull: c.FrecuenciaCompra_full,
        status: c.Status,
        aditionalData: {},
        createdAt: c.FchCreacionSN && new Date(c.FchCreacionSN),
        contactFirstName: c.ContactFirstName,
        contactLastName: c.ContactLastName,
      }));
      return {
        data,
        limit,
        offset,
        total: data.length,
      };
    } catch (error) {
      this.logger.error(`Failed`, error);
      throw new Error(`Failed to retrieve customers: ${error.message}`);
    }
  }

  async findCustomerById(customerId: string) {
    this.logger.log(`Find customer by id`);
    try {
      const result = await this.query<CustomerSap>(
        `SELECT x.*
      FROM [ODBC MAESTRO SN-C GLOBALFROZEN_SALES_BOT_SAMPLE] x
      WHERE x.CodSap = '${customerId}';`,
      );
      return {
        data: result[0],
      };
    } catch (error) {
      this.logger.error(`Failed`, error);
      throw new Error(`Failed to retrieve customer: ${error.message}`);
    }
  }

  async findProducts() {
    this.logger.log(`Find products`);
    try {
      const result = await this.query<any>(`
           SELECT
  o.ItemCode,
  o.ItemName,
  o.U_SUBFAMILIA,
  o.U_Familia3,
  o.U_NombreCorto,
  o.U_NombreComun,
  o.SellItem,
  o.frozenFor,
  p.Price AS ItemPrice,
  SalPackUn,
  SalUnitMsr,
  CASE
        WHEN LOWER(SalUnitMsr) = 'kg' THEN 'Caja'
        WHEN LOWER(SalUnitMsr) = 'lt' THEN 'Bidón'
        WHEN LOWER(SalUnitMsr) = 'un' THEN 'Bolsa'
        ELSE 'Desconocido'
    END AS SalPackUnName,
   SalPackUn * Price as SalPackUnPrice
FROM OITM o
LEFT JOIN ITM1 p ON o.ItemCode = p.ItemCode
WHERE o.SellItem = 'Y'
  AND o.InvntItem = 'Y'
  AND PriceList = 10;`);
      const data: ExternalProduct[] = result.map((p: any) => ({
        id: p.ItemCode,
        code: p.ItemCode,
        name: p.ItemName,
        category: p.U_SUBFAMILIA,
        subcategory: p.U_Familia3,
        family3: p.U_Familia3,
        shortName: p.U_NombreCorto,
        commonName: p.U_NombreComun,
        price: p.ItemPrice,
        unitLabel: p.SalUnitMsr || null,
        packageUnit: p.SalPackUn || null,
        packageUnitPrice: p.SalPackUnPrice || null,
        packageLabel: p.SalPackUnName || null,
        metadata: { sap: { sellItem: p.SellItem, frozenFor: p.frozenFor } },
      }));
      return {
        data,
      };
    } catch (error) {
      this.logger.error(`Failed`, error);
      throw new Error(`Failed to retrieve customers: ${error.message}`);
    }
  }

  async findCustomerNonOrderProducts() {
    this.logger.log(`Find CustomerNonOrderProducts`);
    try {
      const dbResult = await this.query<any>(
        `select * from CustomerNonOrderedProducts;`,
      );
      const result: ExternalCustomerNonOrderProduct[] = dbResult?.map(
        (p: any) => ({
          productId: p.ItemCode,
          productSku: p.ItemCode,
          productName: p.ItemName,
          externalCustomerId: p.CardCode,
          lastOrderDate: p.LastOrderDate,
        }),
      );
      return {
        data: result,
      };
    } catch (error) {
      this.logger.error(`Failed`, error);
      throw new Error(`Failed to retrieve: ${error.message}`);
    }
  }

  async findOrders() {
    this.logger.log(`Find getCustomerLastOrder`);
    try {
      const result = await this.query<any>(`select * from LastOrders;`);
      const customerOrders: ExternalOrder[] = result.map((p: any) => ({
        id: p.DocEntry,
        customerId: p.CustomerID,
        orderDate: new Date(p.PurchaseDate),
        orderTotal: p.DocTotal || 0,
        orderNumber: p.DocEntry,
      }));
      return {
        data: customerOrders,
        total: customerOrders.length,
      };
    } catch (error) {
      this.logger.error(`Failed`, error);
      throw new Error(`Failed to retrieve customers: ${error.message}`);
    }
  }

  async findCustomerLastOrders() {
    this.logger.log(`Find getCustomerLastOrder`);
    try {
      const result = await this.query<any>(`
              SELECT lo.*
              FROM LastOrders lo
              ORDER BY lo.DocDate DESC;`);
      const orders: ExternalLastOrder[] = result.map((p: any) => ({
        id: p.DocEntry,
        customerId: p.CardCode,
        orderDate: new Date(p.DocDate),
        orderTotal: 0,
      }));
      return {
        data: orders,
        total: orders.length,
      };
    } catch (error) {
      this.logger.error(`Failed`, error);
      throw new Error(`Failed to retrieve orders: ${error.message}`);
    }
  }

  async findOrderItems(docEntry: string) {
    this.logger.log(`Find getCustomerLastOrderItem`);
    try {
      const result = await this.query<any>(`
        select loi.* from LastOrderItems loi
        where loi.DocEntry = '${docEntry}';
        `);
      const items: ExternalLastOrderItem[] = result.map((p: any) => ({
        id: p.ID,
        externalOrderId: p.DocEntry,
        itemName: p.ItemName,
        lineNum: p.LineNum,
        itemCode: p.ItemCode,
        quantity: p.Quantity,
        total: p.LineTotal,
      }));
      return {
        data: items,
        total: items.length,
      };
    } catch (error) {
      this.logger.error(`Failed`, error);
      throw new Error(`Failed to retrieve order items: ${error.message}`);
    }
  }
}
