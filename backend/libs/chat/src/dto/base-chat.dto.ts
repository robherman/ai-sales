import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ChatMetadata } from '../interfaces/chat.interface';
import { ChatMessageEntity } from '../entities/chat-message.entity';

export class BaseChatDto {
  @ApiProperty({ description: 'Unique identifier of the chat' })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'User ID associated with the chat',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'Chatbot ID associated with the chat',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  chatbotId?: string;

  @ApiProperty({
    description: 'Customer ID associated with the chat',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  customerId?: string;

  @ApiProperty({ description: 'Title of the chat' })
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Current status of the chat',
    enum: ['active', 'completed', 'archived'],
  })
  @IsOptional()
  status?: 'active' | 'completed' | 'archived';

  @ApiProperty({ description: 'Creation date of the chat' })
  @IsOptional()
  createdAt?: Date;

  @ApiProperty({ description: 'Last update date of the chat' })
  @IsOptional()
  updatedAt?: Date;

  @ApiProperty()
  @IsObject()
  messages: ChatMessageEntity[];

  @ApiProperty()
  @IsObject()
  metadata: ChatMetadata;

  @ApiProperty()
  @IsBoolean()
  isArchived: boolean;

  @ApiProperty()
  @IsObject()
  lastUserMessage?: any;

  @ApiProperty()
  @IsObject()
  lastMessage?: any;

  @ApiProperty()
  @IsArray()
  history: any[];

  @ApiProperty()
  @IsArray()
  historyWithoutLast: any[];

  @ApiProperty()
  @IsObject()
  @IsOptional()
  customer?: any;
}
