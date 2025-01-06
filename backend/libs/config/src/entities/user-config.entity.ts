import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UserEntity } from '../../../users/src/entities/user.entity';
import { UserConfigSettings } from '../interfaces/user-config.interface';

@Entity({ name: 'user_config' })
export class UserConfigEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'jsonb', default: {} })
  settings: UserConfigSettings;

  @Column({ nullable: true, name: 'active_chatbot_id' })
  activeChatbotId: string;
}
