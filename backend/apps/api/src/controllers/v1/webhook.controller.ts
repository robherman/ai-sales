import { Controller, Post, Body, Param } from '@nestjs/common';
import { ConversationChannelIntegrationService } from '../../../../../libs/conversation/src/services/channel-integration.service';

@Controller('v1/webhook')
export class WebhookController {
  constructor(
    private channelIntegrationService: ConversationChannelIntegrationService,
  ) {}

  @Post(':channel')
  async handleWebhook(@Param('channel') channel: string, @Body() payload: any) {
    const { externalUserId, message, companyId } = this.parsePayload(
      channel,
      payload,
    );

    return this.channelIntegrationService.handleIncomingMessage(
      channel,
      externalUserId,
      message,
      companyId,
    );
  }

  private parsePayload(
    channel: string,
    payload: any,
  ): { externalUserId: string; message: string; companyId: string } {
    // Implementa la lógica de parsing específica para cada canal
    switch (channel) {
      case 'whatsapp':
        return payload;
      case 'web':
        return payload;
      default:
        return payload;
    }
  }
}
