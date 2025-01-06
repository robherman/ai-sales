import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { CustomersService } from './services/customers.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  controllers: [],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
