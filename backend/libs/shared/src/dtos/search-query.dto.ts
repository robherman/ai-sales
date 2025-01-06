import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchQueryDto {
  @ApiProperty({ description: 'The search query string' })
  @IsString()
  query: string;

  @ApiProperty({
    description: 'The number of results to return',
    minimum: 1,
    maximum: 20,
    default: 4,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  limit: number = 4;
}
