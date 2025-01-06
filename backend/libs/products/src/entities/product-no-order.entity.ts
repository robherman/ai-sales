import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product_no_order')
export class ProductNoOrderEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ nullable: true, name: 'product_id' })
  productId: string;

  @Column({ nullable: true })
  sku: string;

  @Column({ nullable: false })
  name: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ name: 'last_ordered' })
  lastOrdered: Date;

  @CreateDateColumn({ type: 'timestamp without time zone', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone', name: 'updated_at' })
  updatedAt: Date;
}
