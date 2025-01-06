import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserConfigEntity } from './entities/user-config.entity';
import { SalesConfigService } from './services/sales-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesConfigEntity } from './entities/sales-config.entity';
import { UserConfigService } from './services/user-config.service';
import appConfig from './config/app.config';
import aiConfig from './config/ai.config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [appConfig, aiConfig] }),
    TypeOrmModule.forFeature([SalesConfigEntity, UserConfigEntity]),
  ],
  providers: [UserConfigService, SalesConfigService],
  exports: [UserConfigService, SalesConfigService, ConfigModule],
})
export class AppConfigModule {}
