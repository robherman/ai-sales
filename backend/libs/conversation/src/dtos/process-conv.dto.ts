import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class ProcessMessageDto {
  @ApiProperty({ description: 'The message from the user' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'The ID of the customer' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ description: 'The ID of the chat session' })
  @IsString()
  @IsNotEmpty()
  chatId: string;

  @ApiProperty({ description: 'The Channel ID of the chat session' })
  @IsString()
  @IsNotEmpty()
  channel: string;

  @ApiProperty()
  @IsOptional()
  options?: any;
}
