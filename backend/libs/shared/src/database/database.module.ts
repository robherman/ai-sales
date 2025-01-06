import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PRIMARY_DB_HOST'),
        port: +configService.get<number>('PRIMARY_DB_PORT')!,
        username: configService.get('PRIMARY_DB_USERNAME'),
        password: configService.get('PRIMARY_DB_PASSWORD'),
        database: configService.get('PRIMARY_DB_NAME'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get('PRIMARY_DB_SYNC') || false,
        autoLoadEntities: true,
        ssl:
          configService.get('NODE_ENV') !== 'production'
            ? false
            : {
                rejectUnauthorized: false,
              },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
