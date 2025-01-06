import {
  IsString,
  IsArray,
  IsObject,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class UpdateChatbotDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  identity?: string;

  @IsString()
  @IsOptional()
  instruction?: string;

  @IsString()
  @IsOptional()
  tone?: string;

  @IsArray()
  @IsOptional()
  languages?: string[];

  @IsObject()
  @IsOptional()
  additionalConfig?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  channel?: string;
}
