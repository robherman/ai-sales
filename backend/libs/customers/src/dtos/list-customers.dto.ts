import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsNumber,
  Min,
  IsObject,
} from 'class-validator';

export class CustomerTableDto {
  id: string;
  name: string;
  fullContactName?: string;
  mobile?: string;
  email?: string;
  businessName?: string;
  lastOrderId?: string;
  lastPurchaseAt?: string;
  totalSpent: number;
  status: string;
  address?: Record<string, any>;
  purchaseFrequency?: string;
  purchaseFrequencyDay?: string;
  createdAt: Date;
}

export enum OrderByCustomer {
  NAME = 'name',
  EMAIL = 'email',
  LAST_PURCHASE_AT = 'lastPurchaseAt',
  LAST_CONTACT_AT = 'lastContactAt',
  CREATED_AT = 'createdAt',
}

export class CustomerQueryDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(OrderByCustomer)
  orderBy?: OrderByCustomer;

  @ApiProperty()
  @IsString()
  @IsOptional()
  order?: 'ASC' | 'DESC';

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  filter?: any;
}
