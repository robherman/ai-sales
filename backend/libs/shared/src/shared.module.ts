import { Module } from '@nestjs/common';
import { LoggerService } from './services/logger.services';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class SharedModule {}
