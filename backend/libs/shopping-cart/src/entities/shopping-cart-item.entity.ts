import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { ProductEntity } from '../../../products/src/entities/product.entity';
import { ShoppingCartEntity } from './shopping-cart.entity';

@Entity('shopping_cart_item')
export class ShoppingCartItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ShoppingCartEntity, {
    onDelete: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  @JoinColumn({
    name: 'shopping_cart_id',
    referencedColumnName: 'id',
  })
  shoppingCart: ShoppingCartEntity;

  @ManyToOne(() => ProductEntity, {
    onDelete: 'CASCADE',
    nullable: true,
    orphanedRowAction: 'delete',
  })
  @JoinColumn({
    name: 'product_id',
    referencedColumnName: 'id',
  })
  product?: ProductEntity;

  @Column({ nullable: false, name: 'shopping_cart_id', type: 'uuid' })
  shoppingCartId: string;

  @Column({ nullable: true, name: 'product_id', type: 'uuid' })
  productId?: string;

  @Column({ nullable: false })
  sku: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ nullable: true })
  subcategory?: string;

  @Column({ nullable: true, type: 'float' })
  price?: number;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  packageQuantity?: number;

  @Column({ nullable: true, name: 'unit_label' })
  unitLabel?: string;

  @Column({ nullable: true, name: 'package_label' })
  packageLabel?: string;

  @Column({ nullable: true, name: 'package_unit_price', type: 'float' })
  packageUnitPrice?: number;

  get Total(): number {
    return this.quantity * (this.price || 0);
  }

  @Expose()
  get total(): number {
    return this.quantity * (this.price || 0);
  }
}
