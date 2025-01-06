import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';
import {
  ChatMessageMetadata,
  ChatMessageType,
} from '../interfaces/chat.interface';

export class AddChatMessageDto {
  @ApiProperty({ description: 'Input Query' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Input Query' })
  @IsString()
  toolResults?: any;

  @ApiProperty({ description: 'message type' })
  @IsString()
  role: ChatMessageType;

  @ApiProperty({ description: 'metadata' })
  @IsObject()
  @IsOptional()
  metadata?: ChatMessageMetadata;
}
