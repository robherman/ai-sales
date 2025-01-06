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
import {} from '../../../../../libs/products/src/dtos/list-products.dto';
import { ProductsNoOrderService } from '../../../../../libs/products/src/services/products-no-order.service';
import { ProductNoOrderQueryDto } from '../../../../../libs/products/src/dtos/list-products-no-order.dto';

@ApiTags('Non Ordered Products')
@ApiBearerAuth()
@Controller({
  path: '/products-no-order',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class ProductsNoOrderController {
  constructor(
    private readonly productsNoOrderService: ProductsNoOrderService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all Non-Ordered products' })
  @ApiResponse({ status: 200, description: 'Return all non-ordered products.' })
  async findAll(@Query() queryDto: ProductNoOrderQueryDto) {
    try {
      return await this.productsNoOrderService.findAll(queryDto);
    } catch (err) {
      console.error(`Failed to get`, err);
      throw new InternalServerErrorException('Failed');
    }
  }
}
