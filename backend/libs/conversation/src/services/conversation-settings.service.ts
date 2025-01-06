import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationSettingEntity } from '../entities/conversation-setting.entity';

@Injectable()
export class ConversationSettingsService {
  constructor(
    @InjectRepository(ConversationSettingEntity)
    private settingsRepository: Repository<ConversationSettingEntity>,
  ) {}

  async getSettings(name: string): Promise<ConversationSettingEntity> {
    return this.settingsRepository.findOneOrFail({
      where: { name, isActive: true },
    });
  }

  async createSettings(
    data: Partial<ConversationSettingEntity>,
  ): Promise<ConversationSettingEntity> {
    const settings = this.settingsRepository.create(data);
    return this.settingsRepository.save(settings);
  }

  async updateSettings(
    id: string,
    data: Partial<ConversationSettingEntity>,
  ): Promise<ConversationSettingEntity> {
    await this.settingsRepository.update(id, data);
    return this.getSettings(id);
  }

  async getDefaultSettings(): Promise<ConversationSettingEntity> {
    return this.getSettings('default');
  }
}
