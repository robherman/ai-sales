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
import { OrdersService } from '@lib/orders';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/auth.guard';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller({
  path: '/orders',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Return all orders.' })
  findAll(@Query() queryDto: any) {
    return this.ordersService.findAll(queryDto);
  }

  @Get('customers/:id')
  @ApiOperation({ summary: 'Get all customer orders' })
  @ApiResponse({ status: 200, description: 'Return all orders.' })
  findAllCustomerOrders(
    @Query() queryDto: any,
    @Param('id') customerId: string,
  ) {
    return this.ordersService.findByCustomer(customerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by id' })
  @ApiResponse({ status: 200, description: 'Return one order by id.' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a order' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
  })
  create(@Body() dto: any) {
    return this.ordersService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: any) {
    return this.ordersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
