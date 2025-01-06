import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserConfigEntity } from '../entities/user-config.entity';
import { UserConfigSettings } from '../interfaces/user-config.interface';

@Injectable()
export class UserConfigService {
  constructor(
    @InjectRepository(UserConfigEntity)
    private userSettingsRepository: Repository<UserConfigEntity>,
  ) {}

  async getUserSettings(userId: string): Promise<UserConfigEntity> {
    let userSettings = await this.userSettingsRepository.findOne({
      where: { userId },
    });

    if (!userSettings) {
      userSettings = await this.createDefaultUserSettings(userId);
    }

    return userSettings;
  }

  private async createDefaultUserSettings(
    userId: string,
  ): Promise<UserConfigEntity> {
    const defaultSettings = this.getDefaultSettings();
    const userSettings = this.userSettingsRepository.create({
      userId,
      settings: defaultSettings,
    });
    return this.userSettingsRepository.save(userSettings);
  }

  private getDefaultSettings(): UserConfigSettings {
    return {
      tone: 'neutral',
    };
  }

  async setActiveChatbot(
    userId: string,
    chatbotId: string,
  ): Promise<UserConfigEntity> {
    const userSettings = await this.getUserSettings(userId);
    userSettings.activeChatbotId = chatbotId;
    return this.userSettingsRepository.save(userSettings);
  }

  async updateUserSettings(
    userId: string,
    newSettings: Partial<UserConfigSettings>,
  ): Promise<UserConfigEntity> {
    const userSettings = await this.getUserSettings(userId);
    userSettings.settings = { ...userSettings.settings, ...newSettings };
    return this.userSettingsRepository.save(userSettings);
  }
}
