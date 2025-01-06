import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'chat_event' })
export class ChatEventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'chat_id' })
  chatId: string;

  @Column({ name: 'event_type' })
  eventType: string;

  @Column({ type: 'jsonb', default: '{}' })
  data: any;

  @Column({ type: 'timestamp' })
  timestamp: Date;
}
