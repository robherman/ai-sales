import { Injectable, Logger } from '@nestjs/common';
import { SapAdapter } from '../adapters/sap.adapter';
import { SalesforceAdapter } from '../adapters/salesforce.adapter';
import { ExternalCustomer } from '../interfaces/external-customer.interface';
import { ExternalProduct } from '../interfaces/external-product.interface';
import { CustomersService } from '../../../customers/src';
import { OrdersService } from '../../../orders/src';
import { ProductsService } from '../../../products/src';
import { ExternalCustomerNonOrderProduct } from '../interfaces/external-customer-non-ordered-product.interface';
import { ProductsNoOrderService } from '../../../products/src/services/products-no-order.service';
import { ExternalLastOrder } from '../interfaces/external-last-order.interface';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class IntegrationsService {
  private logger = new Logger(IntegrationsService.name);
  private readonly BATCH_SIZE = 1000;

  constructor(
    private sapAdapter: SapAdapter,
    private salesforceAdapter: SalesforceAdapter,
    private customerService: CustomersService,
    private ordersService: OrdersService,
    private productService: ProductsService,
    private productNoOrderService: ProductsNoOrderService,
    @InjectQueue('sync') private readonly syncQueue: Queue,
  ) {}

  async getAllClients(): Promise<ExternalCustomer[]> {
    const { data: sapClients } = await this.sapAdapter.findCustomers(
      {},
      5000,
      7000,
    );
    const { data: salesforceClients } =
      await this.salesforceAdapter.findClients();

    const mappedSapClients = sapClients.map((i: any) => ({
      ...i,
    }));
    const mappedSalesforceClients = salesforceClients.map((i: any) => ({
      ...i,
    }));
    return [...mappedSapClients, ...mappedSalesforceClients];
  }

  async getAllProducts(): Promise<ExternalProduct[]> {
    const { data: sapProducts } = await this.sapAdapter.findProducts();

    return [...sapProducts];
  }

  async getAllCustomerNonOrderProducts(): Promise<
    ExternalCustomerNonOrderProduct[]
  > {
    const { data: sapProducts } =
      await this.sapAdapter.findCustomerNonOrderProducts();

    return [...sapProducts];
  }

  async getAllOrders(): Promise<ExternalLastOrder[]> {
    const { data: sapOrders } = await this.sapAdapter.findCustomerLastOrders();

    const mappedSapOrders = sapOrders.map((i: any) => ({
      ...i,
    }));
    return [...mappedSapOrders];
  }

  async syncExternalClients(): Promise<void> {
    const lastSyncDate = await this.getLastSyncDate('clients');
    const externalClients = await this.getAllClients();
    await this.processBatch(externalClients, 'upsertClient', 'clients');
    await this.updateLastSyncDate('clients');
  }

  async syncExternalOrders(): Promise<void> {
    const lastSyncDate = await this.getLastSyncDate('orders');
    const data = await this.getAllOrders();
    await this.processBatch(data, 'upsertOrder', 'orders');
    await this.updateLastSyncDate('orders');
  }

  async syncExternalProducts(): Promise<void> {
    const lastSyncDate = await this.getLastSyncDate('products');
    const data = await this.getAllProducts();
    await this.processBatch(data, 'upsertProduct', 'products');
    await this.updateLastSyncDate('products');
  }

  async syncCustomerNonOrderProducts(): Promise<void> {
    this.logger.log(`Sync CustomerNonOrderProducts`);
    const lastSyncDate = await this.getLastSyncDate('customerNonOrderProducts');
    const data = await this.getAllCustomerNonOrderProducts();
    await this.processBatch(
      data,
      'upsertCustomerNonOrderProduct',
      'customerNonOrderProducts',
    );
    await this.updateLastSyncDate('customerNonOrderProducts');
  }

  async fullSync(): Promise<void> {
    this.logger.log('Starting full sync');
    await Promise.all([
      this.syncExternalClients(),
      this.syncExternalOrders(),
      this.syncExternalProducts(),
      this.syncCustomerNonOrderProducts(),
    ]);
    this.logger.log('Full sync completed');
  }

  async upsertClient(externalClient: ExternalCustomer): Promise<void> {
    try {
      const customer =
        await this.customerService.upsertExternalClient(externalClient);
      return customer;
    } catch (error) {
      this.logger.error(`Error updating customer`, error);
    }
  }

  async upsertOrder(externalOrder: ExternalLastOrder): Promise<void> {
    try {
      this.logger.debug('External: ', { order: externalOrder });
      const updatedOrder = await this.ordersService.upsertOrder(externalOrder);
      if (!updatedOrder) {
        throw new Error(
          `Failed to upsert order with external ID: ${externalOrder.id}`,
        );
      }
      const orderItems = await this.sapAdapter.findOrderItems(externalOrder.id);
      if (!orderItems || !orderItems.data || orderItems.data.length === 0) {
        this.logger.warn('No order items found for order', {
          orderId: externalOrder.id,
        });
        return;
      }
      const addedItemPromises = orderItems.data.map((x) =>
        this.ordersService.addOrderItem({
          externalId: x.itemCode,
          sku: x.itemCode,
          name: x.itemName,
          quantity: x.quantity,
          orderId: updatedOrder.id,
        }),
      );
      await Promise.all(addedItemPromises);
    } catch (error) {
      this.logger.error(`Error updating order`, error);
    }
  }

  async upsertProduct(externalProduct: ExternalProduct): Promise<void> {
    try {
      const result = await this.productService.upsertProduct(externalProduct);
      return result;
    } catch (error) {
      this.logger.error(`Error updating product`, error);
    }
  }

  async upsertCustomerNonOrderProduct(dto: ExternalCustomerNonOrderProduct) {
    try {
      const customerId = await this.customerService.findOneByExternalId(
        dto.externalCustomerId,
      );
      const product = await this.productService.findOneByExternalId(
        dto.productSku,
      );
      if (!product) {
        return;
      }
      const result = await this.productNoOrderService.upsertProduct(
        { ...dto, productId: product.id },
        customerId?.id,
      );
      return result;
    } catch (error) {
      this.logger.error(`Error updating product`, error);
    }
  }

  private async processBatch<T>(
    data: T[],
    method: keyof IntegrationsService,
    syncType: string,
  ): Promise<void> {
    for (let i = 0; i < data.length; i += this.BATCH_SIZE) {
      const batch = data.slice(i, i + this.BATCH_SIZE);
      await this.syncQueue.add('processBatch', { batch, method, syncType });
    }
  }

  private async getLastSyncDate(syncType: string): Promise<Date> {
    // const lastSync = await this.syncMetadataRepository.findOne({
    //   where: { type: syncType },
    // });
    // return lastSync ? lastSync.lastSyncDate : new Date(0);

    return new Date();
  }

  private async updateLastSyncDate(syncType: string): Promise<void> {
    // await this.syncMetadataRepository.upsert(
    //   { type: syncType, lastSyncDate: new Date() },
    //   { conflictPaths: ['type'] },
    // );
  }

  async pauseSync(syncType: string): Promise<void> {
    await this.syncQueue.pause();
    this.logger.log(`Paused sync for ${syncType}`);
  }

  async resumeSync(syncType: string): Promise<void> {
    await this.syncQueue.resume();
    this.logger.log(`Resumed sync for ${syncType}`);
  }

  async cancelSync(syncType: string): Promise<void> {
    const jobs = await this.syncQueue.getJobs(['active', 'waiting', 'delayed']);
    for (const job of jobs) {
      if (job.data.syncType === syncType) {
        await job.remove();
      }
    }
    this.logger.log(`Canceled sync for ${syncType}`);
  }

  async getSyncStatus(syncType: string): Promise<{
    active: number;
    waiting: number;
    completed: number;
    failed: number;
  }> {
    const jobCounts = await this.syncQueue.getJobCounts();

    // Filter jobs by syncType
    const jobs = await this.syncQueue.getJobs([
      'active',
      'waiting',
      'completed',
      'failed',
    ]);
    const filteredJobs = jobs.filter((job) => job.data.syncType === syncType);

    const counts = {
      active: 0,
      waiting: 0,
      completed: 0,
      failed: 0,
    };

    for (const job of filteredJobs) {
      if (await job.isActive()) counts.active++;
      else if (await job.isWaiting()) counts.waiting++;
      else if (await job.isCompleted()) counts.completed++;
      else if (await job.isFailed()) counts.failed++;
    }
    return counts;
  }

  async retryFailedJobs(syncType: string): Promise<void> {
    const failedJobs = await this.syncQueue.getFailed();
    for (const job of failedJobs) {
      if (job.data.syncType === syncType) {
        await job.retry();
      }
    }
    this.logger.log(`Retried failed jobs for ${syncType}`);
  }
}
