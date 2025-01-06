import {
  IsString,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateSettingsDto {
  @IsString()
  name: string;

  @IsInt()
  maxHistory: number;

  @IsInt()
  maxTokens: number;

  @IsNumber()
  temperature: number;

  @IsObject()
  @IsOptional()
  additionalSettings?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateSettingsDto {
  @IsInt()
  maxHistory: number;

  @IsInt()
  maxTokens: number;

  @IsNumber()
  temperature: number;

  @IsObject()
  @IsOptional()
  additionalSettings?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
