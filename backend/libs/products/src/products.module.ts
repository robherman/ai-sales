import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductsService } from './services/products.service';
import { ProductNoOrderEntity } from './entities/product-no-order.entity';
import { ProductsNoOrderService } from './services/products-no-order.service';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forFeature([ProductEntity, ProductNoOrderEntity]),
  ],
  controllers: [],
  providers: [ProductsService, ProductsNoOrderService],
  exports: [ProductsService, ProductsNoOrderService],
})
export class ProductsModule {}
