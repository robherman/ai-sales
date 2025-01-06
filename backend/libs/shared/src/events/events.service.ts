import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
  constructor() {}

  async publish(exchange: string, routingKey: string, message: any) {
    // await this.amqpConnection.publish(exchange, routingKey, message);
  }

  async subscribe(queue: string, handler: (msg: any) => void) {
    // await this.amqpConnection.createConsumer(queue, handler);
  }
}
