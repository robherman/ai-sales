import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotEntity } from './entities/chatbot.entity';
import { ChatbotService } from './services/chatbot.service';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([ChatbotEntity]),
  ],
  providers: [ChatbotService],
  exports: [ChatbotService],
})
export class ChatbotModule {}
