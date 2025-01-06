import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional } from 'class-validator';

export class CreateChatDto {
  @ApiPropertyOptional({
    description: 'User ID associated with the chat',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Chatbot ID associated with the chat',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  chatbotId?: string;

  @ApiPropertyOptional({
    description: 'Company ID associated with the chat',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  companyId?: string;

  @ApiPropertyOptional({
    description: 'Customer ID associated with the chat',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  customerId?: string;

  @ApiPropertyOptional({ description: 'Title of the chat' })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Channel of the chat' })
  @IsOptional()
  channel?: string;
}
