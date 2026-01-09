import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Topic } from './topics/entities/topic.entity';
import { User } from './users/entities/user.entity';
import { TopicPermission } from './topics/entities/topic-permission.entity';
import { Channel } from './channel/entities/channel.entity';

// Load environment variables for CLI usage
const env = process.env.NODE_ENV || 'dev';
config({ path: `.env.${env}` });

// Shared configuration
const baseConfig = {
  type: 'mysql' as const,
  entities: [User, Topic, TopicPermission, Channel],
  synchronize: false, // Set to true in development
  logging: false,
  migrationsTableName: 'migrations',
  migrationsTransactionMode: 'all' as const,
};

// DataSource for TypeORM CLI
export const AppDataSource = new DataSource({
  ...baseConfig,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: ['migrations/*.ts'],
});

// NestJS TypeORM configuration service
@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) { }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      ...baseConfig,
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      migrationsRun: true,
      migrations: [__dirname + '/migrations/*.{js,ts}'],
    };
  }
}
