import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsNumber,
  Min,
  IsObject,
} from 'class-validator';

export enum OrderByProduct {
  NAME = 'name',
  SKU = 'sku',
  CREATED_AT = 'createdAt',
  PACKAGE_PRICE = 'packageUnitPrice',
  PRICE = 'price',
  SORT = 'isFeatured',
}

export class ProductQueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(OrderByProduct)
  orderBy?: OrderByProduct;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  order?: 'ASC' | 'DESC';

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  filter?: any;
}
