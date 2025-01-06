import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {} from '@lib/customers';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { IntegrationsService } from '../../../../../libs/integrations/src';

@ApiTags('Integrations')
@ApiBearerAuth()
@Controller({
  path: '/integrations',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class IntegrationsController {
  constructor(private integrationsService: IntegrationsService) {}

  @Post('customers/sync')
  @ApiOperation({ summary: 'Sync customers' })
  @ApiResponse({
    status: 200,
    description: 'Sync completed.',
  })
  syncCustomers() {
    return this.integrationsService.syncExternalClients();
  }

  @Post('orders/sync')
  @ApiOperation({ summary: 'Sync orders' })
  @ApiResponse({
    status: 200,
    description: 'Sync completed',
  })
  syncOrders() {
    return this.integrationsService.syncExternalOrders();
  }

  @Post('products/sync')
  @ApiOperation({ summary: 'Sync products' })
  @ApiResponse({
    status: 200,
    description: 'Sync completed',
  })
  syncProducts() {
    return this.integrationsService.syncExternalProducts();
  }

  @Post('customer-non-order-products/sync')
  @ApiOperation({ summary: 'Sync products' })
  @ApiResponse({
    status: 200,
    description: 'Sync completed',
  })
  syncCustomerNonOrderProducts() {
    return this.integrationsService.syncCustomerNonOrderProducts();
  }

  @Post(':syncType/pause')
  async pauseSync(@Param('syncType') syncType: string) {
    await this.integrationsService.pauseSync(syncType);
    return { message: `Sync paused for ${syncType}` };
  }

  @Post(':syncType/resume')
  async resumeSync(@Param('syncType') syncType: string) {
    await this.integrationsService.resumeSync(syncType);
    return { message: `Sync resumed for ${syncType}` };
  }

  @Post(':syncType/cancel')
  async cancelSync(@Param('syncType') syncType: string) {
    await this.integrationsService.cancelSync(syncType);
    return { message: `Sync cancelled for ${syncType}` };
  }

  @Get(':syncType/status')
  async getSyncStatus(@Param('syncType') syncType: string) {
    return await this.integrationsService.getSyncStatus(syncType);
  }

  @Post(':syncType/retry')
  async retryFailedJobs(@Param('syncType') syncType: string) {
    await this.integrationsService.retryFailedJobs(syncType);
    return { message: `Failed jobs retried for ${syncType}` };
  }
}
