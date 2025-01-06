import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ChatbotConfig } from '../interfaces/chatbot.interface';
import { PromptTemplateEntity } from '../../../prompts/src/entites/prompt-template.entity';

@Entity({ name: 'chatbot' })
export class ChatbotEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true, name: 'identity_prompt_template_id' })
  identityPromptTemplateId?: string;

  @Column({ nullable: true, name: 'instructions_prompt_template_id' })
  instructionsPromptTemplateId?: string;

  @Column({ nullable: true })
  tone?: string;

  @Column('simple-array', { default: [] })
  languages: string[];

  @Column({ nullable: true })
  channel?: string;

  @Column({ type: 'jsonb', default: {}, name: 'additional_config' })
  additionalConfig: ChatbotConfig;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @ManyToOne(() => PromptTemplateEntity, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({
    name: 'instructions_prompt_template_id',
    referencedColumnName: 'id',
  })
  instructionsPromptTemplate: PromptTemplateEntity;

  @ManyToOne(() => PromptTemplateEntity, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({
    name: 'identity_prompt_template_id',
    referencedColumnName: 'id',
  })
  identityPromptTemplate: PromptTemplateEntity;
}
