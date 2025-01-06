import {
  Controller,
  Get,
  UseGuards,
  Query,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { RecommendationsService } from '../../../../../libs/recommendations/src';
import { ListRecommendationsDto } from '../../../../../libs/recommendations/src/recommendations.dto';

@ApiTags('Recommendations')
@ApiBearerAuth()
@Controller({
  path: '/recommendations',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class RecommendationsController {
  constructor(private readonly recommendationService: RecommendationsService) {}

  @Get('/products')
  @ApiOperation({ summary: 'AI Product recommendations' })
  @ApiResponse({
    status: 200,
    description: 'Return all ai-generated recommendations for a customer.',
  })
  async findAll(@Query() queryDto: ListRecommendationsDto) {
    const { customerId, limit } = queryDto;
    try {
      return await this.recommendationService.getRecommendations(
        customerId,
        limit,
      );
    } catch (err) {
      console.error(`Failed to get`, err);
      throw new InternalServerErrorException('Failed');
    }
  }
}
