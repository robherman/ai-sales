import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ChatEntity } from './chat.entity';
import {
  ChatMessageMetadata,
  ChatMessageType,
} from '../interfaces/chat.interface';

@Entity({ name: 'chat_message' })
export class ChatMessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ChatEntity, {
    onDelete: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  @JoinColumn({
    name: 'chat_id',
    referencedColumnName: 'id',
  })
  chat: ChatEntity;

  @Column({ nullable: false, name: 'chat_id', type: 'uuid' })
  chatId: string;

  @Column({ type: 'varchar' })
  role: ChatMessageType;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  toolResults?: any;

  @Column({ type: 'jsonb', default: '{}' })
  metadata: ChatMessageMetadata;

  @CreateDateColumn()
  createdAt: Date;
}
