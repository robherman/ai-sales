import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InitializeConversationDto {
  @ApiProperty({ description: 'The ID of the chatbot to use' })
  @IsString()
  @IsNotEmpty()
  chatbotId: string;

  @ApiProperty({ description: 'The ID of the customer' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ description: 'The Company ID ' })
  @IsString()
  @IsNotEmpty()
  companyId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  channel: string;
}
