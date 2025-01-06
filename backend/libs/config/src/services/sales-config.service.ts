import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesConfigEntity } from '../entities/sales-config.entity';

@Injectable()
export class SalesConfigService {
  constructor(
    @InjectRepository(SalesConfigEntity)
    private salesConfigRepository: Repository<SalesConfigEntity>,
  ) {}

  async getConfig(): Promise<SalesConfigEntity> {
    return this.salesConfigRepository.findOneOrFail({
      where: { isActive: true },
    });
  }

  async updateConfig(
    config: Partial<SalesConfigEntity>,
  ): Promise<SalesConfigEntity> {
    const existingConfig = await this.getConfig();
    const updatedConfig = { ...existingConfig, ...config };
    return this.salesConfigRepository.save(updatedConfig);
  }
}
