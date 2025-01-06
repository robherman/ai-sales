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
import { CustomersService } from '@lib/customers';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateCustomerDto } from '@lib/customers/dtos/create-customer.dto';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { CustomerQueryDto } from '@lib/customers/dtos/list-customers.dto';

@ApiTags('Customers')
@ApiBearerAuth()
@Controller({
  path: '/customers',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'Return all customers.' })
  findAll(@Query() queryDto: CustomerQueryDto) {
    return this.customersService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by id' })
  @ApiResponse({ status: 200, description: 'Return one customer by id.' })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a customer' })
  @ApiResponse({
    status: 201,
    description: 'The customer has been successfully created.',
  })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: any) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
