import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { CompanySettings } from '../interfaces/company.interface';

@Entity({ name: 'company' })
export class CompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column('text')
  description: string;

  @Column()
  website: string;

  @Column()
  email: string;

  @Column()
  mobile: string;

  @Column({ type: 'jsonb', default: {}, name: 'additional_config' })
  additionalConfig: CompanySettings;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;
}
