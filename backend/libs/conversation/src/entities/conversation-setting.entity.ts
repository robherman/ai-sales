import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'conversation_setting' })
export class ConversationSettingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('int')
  maxHistory: number;

  @Column('int')
  maxTokens: number;

  @Column('float')
  temperature: number;

  @Column({ type: 'jsonb', nullable: true, name: 'additional_settings' })
  additionalSettings: Record<string, any>;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
