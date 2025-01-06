import {
  IsString,
  IsObject,
  IsOptional,
  IsBoolean,
  IsInt,
} from 'class-validator';

export class CreateGreetingDto {
  @IsString()
  name: string;

  @IsString()
  content: string;

  @IsObject()
  @IsOptional()
  conditions?: Record<string, any>;

  @IsInt()
  @IsOptional()
  priority?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateGreetingDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsObject()
  @IsOptional()
  conditions?: Record<string, any>;

  @IsInt()
  @IsOptional()
  priority?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
