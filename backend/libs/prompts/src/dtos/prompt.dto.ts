import { IsString, IsObject, IsOptional, IsBoolean } from 'class-validator';

export class CreatePromptTemplateDto {
  @IsString()
  name: string;

  @IsString()
  content: string;

  @IsObject()
  @IsOptional()
  variables?: Record<string, string>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdatePromptTemplateDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsObject()
  @IsOptional()
  variables?: Record<string, string>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
