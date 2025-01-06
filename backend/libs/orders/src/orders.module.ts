import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderNoteEntity } from './entities/order-note.entity';
import { OrdersService } from './services/orders.service';
import { CustomersModule } from '../../customers/src';
import { ProductsModule } from '../../products/src';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, OrderNoteEntity]),
    CustomersModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
