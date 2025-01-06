import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ nullable: true })
  sku: string;

  @Column({ nullable: true })
  externalId: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true, name: 'short_name' })
  shortName: string;

  @Column({ nullable: true, name: 'common_name' })
  commonName: string;

  @Column({ nullable: false })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true, name: 'long_description' })
  longDescription: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  subcategory: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    nullable: true,
    name: 'special_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  specialPrice: number;

  @Column({
    nullable: true,
    name: 'retail_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  retailPrice: number;

  @Column({ default: true, name: 'manage_stock' })
  manageStock: boolean;

  @Column({ nullable: true, type: 'float' })
  stock: number;

  @Column({ nullable: true, name: 'unit_label' })
  unitLabel: string;

  @Column({ nullable: true, name: 'package_unit', type: 'float' })
  packageUnit: number;

  @Column({ nullable: true, name: 'package_label' })
  packageLabel: string;

  @Column({ nullable: true, name: 'package_unit_price', type: 'float' })
  packageUnitPrice: number;

  @Column({ nullable: true, name: 'is_offer' })
  isOffer: boolean;

  @Column({ nullable: true, default: false, name: 'is_featured' })
  isFeatured: boolean;

  // @ManyToOne(() => CategoryEntity, (category) => category.products)
  // category: CategoryEntity;

  // @ManyToMany(() => Order, (order) => order.products)
  // orders: Order[];

  @CreateDateColumn({ type: 'timestamp without time zone', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp without time zone',
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt: Date;

  // @Expose()
  // get packageLabel(): string {
  //   return ['KG', 'LT'].includes(this.unitLabel) ? 'Caja' : 'Bolsa';
  // }
}
