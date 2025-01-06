import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

@Module({})
export class BullConfigModule {
  static forRoot(): DynamicModule {
    return {
      module: BullConfigModule,
      imports: [
        BullModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            redis: {
              host: configService.get('REDIS_HOST'),
              port: configService.get('REDIS_PORT'),
              password: configService.get('REDIS_PASSWORD'),
            },
            defaultJobOptions: {
              attempts: 3,
              backoff: {
                type: 'exponential',
                delay: 1000,
              },
            },
          }),
          inject: [ConfigService],
        }),
      ],
      exports: [BullModule],
    };
  }

  static forFeature(queueName: string): DynamicModule {
    return BullModule.registerQueue({
      name: queueName,
    });
  }
}
