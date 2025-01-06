import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ShoppingCartService } from '@lib/shopping-cart';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/auth.guard';

@ApiTags('ShoppingCart')
@ApiBearerAuth()
@Controller({
  path: '/shopping-carts',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class ShoppingCartController {
  constructor(private readonly shoppingCartsService: ShoppingCartService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get order by id' })
  @ApiResponse({ status: 200, description: 'Return one order by id.' })
  findOne(@Param('id') id: string) {
    return this.shoppingCartsService.findCartById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Clears cart items' })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully cleared.',
  })
  create(@Body() dto: any) {
    return this.shoppingCartsService.clearCart(dto);
  }
}
