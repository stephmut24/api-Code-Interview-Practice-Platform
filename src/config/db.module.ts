import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        database: configService.get('DB_NAME'),
        host: 'localhost',
        type: 'postgres',
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        port: configService.get('DB_PORT'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {
  constructor(private readonly configuration: ConfigService) {}
  checkDB() {}
}
