import { Module } from '@nestjs/common';
import { ShoppingCartService } from './services/shopping-cart.service';
import { ShoppingCartWooCommerceService } from './services/shopping-cart-woo-commerce.service';
import { HttpModule } from '@nestjs/axios';
import { AppConfigModule } from '../../config/src';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingCartEntity } from './entities/shopping-cart.entity';
import { ShoppingCartItemEntity } from './entities/shopping-cart-item.entity';
import { ProductsModule } from '../../products/src';

@Module({
  imports: [
    HttpModule,
    AppConfigModule,
    TypeOrmModule.forFeature([ShoppingCartEntity, ShoppingCartItemEntity]),
    ProductsModule,
  ],
  providers: [ShoppingCartService, ShoppingCartWooCommerceService],
  exports: [ShoppingCartService],
})
export class ShoppingCartModule {}
