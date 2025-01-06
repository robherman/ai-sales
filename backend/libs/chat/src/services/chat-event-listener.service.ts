import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ChatService } from '../../../chat/src';

@Injectable()
export class ChatEventListener {
  private logger = new Logger(ChatEventListener.name);

  constructor(private chatService: ChatService) {}

  @OnEvent('chat.processing')
  handleInputProcessed(event: any) {
    this.logger.log(`Event - Processing`);
    // stream response
  }

  @OnEvent('chat.stream')
  async handleResponseStreamEvent(event: {
    chatId: string;
    userId: string;
    message: string;
  }) {
    this.logger.log(`Event - Response Stream`);
    try {
    } catch (err) {
      this.logger.error(err);
    }
  }

  @OnEvent('chat.response')
  async handleResponseEvent(event: {
    chatId: string;
    userId: string;
    message: { content: string; type: any; metadata: any };
    stream?: boolean;
  }) {
    this.logger.log(`Event - Response`);
    try {
      await this.chatService.addMessage(event.chatId, event.message);
    } catch (err) {
      this.logger.error(err);
    }
  }

  @OnEvent('chat.response_error')
  async handleResponseErrorEvent(event: { error: string; chatId: string }) {
    this.logger.log(`Event - Response Error`);
    try {
      await this.chatService.addMessage(event.chatId, {
        type: 'system',
        content: `Error: ${event.error}`,
      });
    } catch (err) {
      this.logger.error(err);
    }
  }

  @OnEvent('chat.finish_stream')
  async handleFinishStreamEvent(event: { chatId: string; userId: string }) {
    this.logger.log(`Event - Finish Stream`);
    try {
    } catch (err) {
      this.logger.error(err);
    }
  }

  @OnEvent('chat.update_state')
  async handleUpdateStateEvent(event: {
    chatbotId: string;
    chatId: string;
    userId: string;
    state: any;
  }) {
    this.logger.log(`Event - Update State`);
  }
}
