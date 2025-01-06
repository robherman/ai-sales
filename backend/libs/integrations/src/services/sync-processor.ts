import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { IntegrationsService } from './integrations.service';

type UpsertMethod = keyof Pick<
  IntegrationsService,
  | 'upsertClient'
  | 'upsertOrder'
  | 'upsertProduct'
  | 'upsertCustomerNonOrderProduct'
>;

@Processor('sync')
export class SyncProcessor {
  private readonly logger = new Logger(SyncProcessor.name);

  constructor(
    private integrationsService: IntegrationsService,
    @InjectQueue('sync') private syncQueue: Queue,
  ) {}

  @Process('processBatch')
  async handleBatch(
    job: Job<{ batch: any[]; method: UpsertMethod; syncType: string }>,
  ) {
    const { batch, method, syncType } = job.data;
    this.logger.log(
      `Processing batch of ${batch.length} items for ${syncType}`,
    );

    const results = await Promise.allSettled(
      batch.map((item) => this.integrationsService[method](item)),
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    this.logger.log(
      `Finished processing batch for ${syncType}. Succeeded: ${succeeded}, Failed: ${failed}`,
    );

    if (failed > 0) {
      const failedItems = batch.filter(
        (_, index) => results[index].status === 'rejected',
      );
      await this.handleFailedItems(failedItems, method, syncType);
    }
  }

  private async handleFailedItems(
    items: any[],
    method: UpsertMethod,
    syncType: string,
  ) {
    this.logger.warn(
      `${items.length} items failed to sync for ${syncType}. Queueing for retry...`,
    );
    await this.syncQueue.add(
      'processBatch',
      { batch: items, method, syncType },
      {
        delay: 60000,
        attempts: 1,
        backoff: {
          type: 'exponential',
          delay: 60000,
        },
      },
    );
  }
}
