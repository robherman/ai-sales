import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { SalesConfigSettings } from '../interfaces/sales-config.interface';

@Entity({ name: 'sales_config' })
export class SalesConfigEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  steps: string;

  @Column({ type: 'float', nullable: true })
  discount?: number;

  @Column({ type: 'float', nullable: true })
  crossSellingDiscount?: number;

  @Column({ type: 'jsonb', default: {} })
  settings: SalesConfigSettings;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
