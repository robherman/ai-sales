import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { CustomerEntity } from '../../../customers/src/entities/customer.entity';
import { ChatMessageEntity } from './chat-message.entity';

@Entity({ name: 'chat' })
export class ChatEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id', nullable: true })
  userId?: string;

  @Column({ type: 'uuid', nullable: true, name: 'customer_id' })
  customerId?: string;

  @Column({ type: 'uuid', nullable: true, name: 'chatbot_id' })
  chatbotId?: string;

  @Column({ type: 'uuid', nullable: true, name: 'company_id' })
  companyId?: string;

  @Column({})
  title: string;

  @Column({ nullable: true })
  channel: string;

  @OneToMany(() => ChatMessageEntity, (message) => message.chat)
  messages: ChatMessageEntity[];

  @Column({ type: 'varchar', default: 'active' })
  status: 'active' | 'completed' | 'archived';

  @Column({ type: 'jsonb', nullable: true })
  context?: any;

  @Column({ nullable: true })
  formattedContext?: string;

  @Column({ type: 'jsonb', nullable: true })
  steps?: any;

  @Column({ type: 'jsonb', nullable: true })
  currentStep?: any;

  @Column({ type: 'jsonb', nullable: true })
  nextStep?: any;

  @Column({ type: 'varchar', nullable: true })
  strategy?: string;

  @Column({ default: 100 })
  maxHistoryCount?: number;

  @Column({ type: 'varchar', nullable: true })
  greeting: string;

  @Column({ type: 'jsonb', nullable: true })
  shoppingCart?: any;

  @Column({ type: 'float', nullable: true })
  crossSellingDiscount?: number;

  @Column({ type: 'jsonb', nullable: true })
  additionalMetadata: any;

  @Column({ default: false })
  isArchived: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => CustomerEntity, {
    nullable: true,
    orphanedRowAction: 'delete',
  })
  @JoinColumn({
    name: 'customer_id',
    referencedColumnName: 'id',
  })
  customer?: CustomerEntity;

  @Expose()
  get lastUserMessage(): ChatMessageEntity | undefined {
    const items = Array.from(this.messages || []);
    return items
      .slice()
      .reverse()
      .find((i) => ['human', 'user'].includes(i.role));
  }

  @Expose()
  get lastMessage(): ChatMessageEntity | undefined {
    return this.messages?.slice().reverse()[0];
  }

  @Expose()
  get history(): ChatMessageEntity[] {
    return this.messages || [];
  }

  get baseMessages(): { role: any; content: string }[] {
    return (
      this.messages?.map((m) => ({ role: m.role, content: m.content })) || []
    );
  }

  @Expose()
  get historyWithoutLast(): ChatMessageEntity[] {
    return this.messages?.slice(0, -1);
  }
}
