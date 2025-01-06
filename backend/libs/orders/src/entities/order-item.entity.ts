import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';
import { Expose } from 'class-transformer';
import { ProductEntity } from '../../../products/src/entities/product.entity';

@Entity('order_item')
export class OrderItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrderEntity, {
    onDelete: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  @JoinColumn({
    name: 'order_id',
    referencedColumnName: 'id',
  })
  order: OrderEntity;

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

  @Column({ nullable: false, name: 'order_id', type: 'uuid' })
  orderId: string;

  @Column({ nullable: true, name: 'product_id', type: 'uuid' })
  productId?: string;

  @Column({ nullable: false })
  sku: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, type: 'float' })
  price: number;

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
    return this.quantity * this.price;
  }

  @Expose()
  get total(): number {
    return this.quantity * this.price;
  }
}
