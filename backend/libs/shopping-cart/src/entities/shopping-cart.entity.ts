import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { ShoppingCartItemEntity } from './shopping-cart-item.entity';
import { CustomerEntity } from '../../../customers/src/entities/customer.entity';

@Entity('shopping_cart')
export class ShoppingCartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_number', nullable: true })
  orderNumber?: number;

  @Column({})
  status: string;

  @Column({ name: 'chat_id', type: 'uuid', nullable: true })
  chatId?: string;

  @Column({ name: 'customer_id', type: 'uuid', nullable: true })
  customerId?: string;

  @Column({ name: 'customer_name', nullable: true })
  customerName?: string;

  @Column({ name: 'customer_email', nullable: true })
  customerEmail?: string;

  @Column({ name: 'customer_phone', nullable: true })
  customerPhone?: string;

  @Column({
    type: 'jsonb',
    name: 'billing_address',
    nullable: true,
  })
  billingAddress: any;

  @Column({
    nullable: true,
    type: 'jsonb',
    name: 'shipping_address',
  })
  shippingAddress: any;

  @Column({
    nullable: true,
    name: 'discount_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  discountAmount: number;

  @Column({ nullable: true, type: 'float', name: 'shipping_amount' })
  shippingAmount: number;

  @Column({ nullable: true, type: 'float' })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ nullable: true, name: 'external_id' })
  externalId?: string;

  @Column({ nullable: true, name: 'woocommerce_checkout_url' })
  wooCommerceCheckoutUrl?: string;

  @CreateDateColumn({ type: 'timestamp without time zone', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp without time zone',
    nullable: true,
    name: 'deleted_at',
  })
  deletedAt: Date;

  @OneToMany(() => ShoppingCartItemEntity, (item) => item.shoppingCart, {
    cascade: true,
    eager: true,
  })
  items: ShoppingCartItemEntity[];

  @ManyToOne(() => CustomerEntity, (customer) => customer.shoppingCarts)
  customer: CustomerEntity;

  @Expose()
  get itemsCount(): number {
    return this.items?.length;
  }

  @Expose({})
  get fullShippingAddress(): string {
    const { address1, city, country, state } = this.shippingAddress || {};
    return (
      (this.shippingAddress && [address1, city, state, country].join(', ')) ||
      ''
    );
  }

  @Expose({})
  get fullBillingAddress(): string {
    const { address1, city, country, state } = this.billingAddress || {};
    return (
      (this.billingAddress && [address1, city, state, country].join(', ')) || ''
    );
  }

  get Total(): number {
    return (
      this.subtotal +
      (this.tax || 0) -
      this.discountAmount +
      (this.shippingAmount || 0)
    );
  }
}
