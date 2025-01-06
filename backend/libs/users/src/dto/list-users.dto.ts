import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

enum OrderByFieldEnum {
  email = 'email',
  firstName = 'firstName',
  lastName = 'lastName',
  createdAt = 'createdAt',
}

export class UsersFilterDto {
  @ApiProperty({
    required: false,
    name: 'Search text [name, sender, receiver, subject]',
  })
  @IsOptional({})
  @IsString()
  readonly q?: string;

  @ApiProperty({
    required: false,
    name: 'Search ids',
  })
  @IsOptional({})
  @IsArray()
  readonly id?: string[];

  @ApiProperty({
    required: false,
    name: 'active',
  })
  @IsOptional({})
  @IsBoolean()
  readonly active?: boolean;
}

export class UsersSortDto {
  @ApiPropertyOptional({ name: 'sort field', enum: OrderByFieldEnum })
  @IsOptional()
  @IsEnum(OrderByFieldEnum)
  readonly field: OrderByFieldEnum;

  order: any;
}

export class UserssListParamsDto {
  @ApiProperty({ name: 'sort', type: UsersSortDto, required: false })
  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  readonly sort?: UsersSortDto;

  @ApiProperty({
    description: 'number of records in a request',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  readonly limit?: number;

  @ApiProperty({
    description: 'records to skip from start',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  readonly offset?: number;

  @ApiProperty({
    name: 'filter',
    type: UsersFilterDto,
    required: true,
  })
  @IsNotEmpty()
  @Transform(({ value }) => JSON.parse(value))
  @Type(() => UsersFilterDto)
  readonly filter: UsersFilterDto;
}
