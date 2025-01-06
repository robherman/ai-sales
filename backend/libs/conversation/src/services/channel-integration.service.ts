import { Injectable } from '@nestjs/common';
import { ChatService } from '../../../chat/src';
import { CustomersService } from '../../../customers/src';

@Injectable()
export class ConversationChannelIntegrationService {
  constructor(
    private chatService: ChatService,
    private customerService: CustomersService,
  ) {}

  async handleIncomingMessage(
    channel: string,
    externalUserId: string,
    message: string,
    companyId: string,
  ): Promise<string> {
    const customer = await this.customerService.findOneByExternalIdAndChannel(
      externalUserId,
      channel,
    );
    if (!customer) {
      //   customer = await this.customerService.create({
      //   });
      throw new Error(`Invalid customer`);
    }

    let chat = await this.chatService.getActiveChat(
      customer.id,
      companyId,
      channel,
    );
    if (!chat) {
      chat = await this.chatService.createChat({
        customerId: customer.id,
        companyId,
        channel,
      });
    }

    // const response = await this.conversationService.processMessage(
    //   chat.id,
    //   message,
    //   channel,
    // );
    return 'response';
  }
}
