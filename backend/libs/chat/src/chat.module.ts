import { Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './entities/chat.entity';
import { ChatAnalyticsService } from './services/chat-analytics.service';
import { ChatEventEntity } from './entities/chat-event.entity';
import { ChatEventService } from './services/chat-event.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChatMessageEntity } from './entities/chat-message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity, ChatEventEntity, ChatMessageEntity]),
    EventEmitterModule.forRoot(),
  ],
  controllers: [],
  providers: [ChatService, ChatAnalyticsService, ChatEventService],
  exports: [ChatService, ChatAnalyticsService],
})
export class ChatModule {}
