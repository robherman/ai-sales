import { Expose } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrderEntity } from '../../../orders/src/entities/order.entity';
import { ChatEntity } from '../../../chat/src/entities/chat.entity';
import { ShoppingCartEntity } from '../../../shopping-cart/src/entities/shopping-cart.entity';

@Entity('customer')
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({})
  name: string;

  @Column({ name: 'contact_first_name', nullable: true })
  contactFirstName: string;

  @Column({ name: 'contact_last_name', nullable: true })
  contactLastName: string;

  @Column({ name: 'business_name', nullable: true })
  businessName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ nullable: true, name: 'doc_number' })
  docNumber: string;

  @Column({ nullable: true, type: 'jsonb' })
  address: any;

  @Column({ nullable: true, type: 'jsonb', name: 'shipping_address' })
  shippingAddress: any;

  @Column({ nullable: true, type: 'jsonb', name: 'billing_address' })
  billingAddress: any;

  @Column({ nullable: true, name: 'carrier_id', type: 'uuid' })
  carrierId: string;

  @Column({ nullable: true, name: 'external_id' })
  externalId: string;

  @Column({ nullable: true, name: 'external_source' })
  externalSource: string;

  @Column({ nullable: true, name: 'external_metadata', type: 'jsonb' })
  externalMetadata: any;

  @Column({ name: 'first_purchase_at', nullable: true })
  firstPurchaseAt: string;

  @Column({ name: 'last_purchase_at', nullable: true })
  lastPurchaseAt: string;

  @Column({ nullable: true })
  balance: number;

  @Column({ nullable: true, name: 'purchase_frequency_day' })
  purchaseFrequencyDay: string;

  @Column({ nullable: true, name: 'purchase_frequency' })
  purchaseFrequency: string;

  @Column({ nullable: true })
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp without time zone' })
  updatedAt: Date;

  @Column({
    name: 'last_contact_at',
    type: 'timestamp without time zone',
    nullable: true,
  })
  lastContactAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp without time zone',
    nullable: true,
  })
  deletedAt: Date;

  @OneToMany(() => OrderEntity, (order) => order.customer)
  orders: OrderEntity[];

  @OneToMany(() => ShoppingCartEntity, (cart) => cart.customer)
  shoppingCarts: ShoppingCartEntity[];

  @OneToMany(() => ChatEntity, (chat) => chat.customer)
  chats: ChatEntity[];

  @Expose({})
  get fullAddress(): string {
    const { address1, city, country, state } = this.address || {};
    return (
      (this.address &&
        [address1, city, state, country].filter((x) => x).join(', ')) ||
      ''
    );
  }

  @Expose({})
  get fullShippingAddress(): string {
    const { address1, city, country, state } = this.shippingAddress || {};
    return (
      (this.shippingAddress &&
        [address1, city, state, country].filter((x) => x).join(', ')) ||
      ''
    );
  }

  @Expose({})
  get fullBillingAddress(): string {
    const { address1, city, country, state } = this.billingAddress || {};
    return (
      (this.billingAddress &&
        [address1, city, state, country].filter((x) => x).join(', ')) ||
      ''
    );
  }

  @Expose({})
  get fullContactName(): string {
    return [this.contactFirstName, this.contactLastName].join(` `);
  }

  @Expose({})
  get isPastCustomer(): boolean {
    return ['Fugado'].includes(this.status);
  }

  @Expose({})
  get isCurrentCustomer(): boolean {
    return ['Basal'].includes(this.status);
  }

  @Expose({})
  get isFutureCustomer(): boolean {
    return !this.isPastCustomer && !this.isCurrentCustomer;
  }

  // @Expose()
  // get lastOrderId(): string | undefined {
  //   return this.lastOrder?.id;
  // }

  get lastOrder(): OrderEntity | undefined {
    return this.orders?.length > 0
      ? this.orders?.reduce((a, b) => (a.orderDate > b.orderDate ? a : b))
      : undefined;
  }
}
