import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

console.log(__dirname);

export = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(<string>process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: true,
  migrationsRun: true,
  // entities: [__dirname, 'src/entities/**/*.entity.{ts,js}'],
  entities: ['dist/**/*.entity.js'],
  // migrations: [__dirname, '..', 'src/database/migrations'],
  migrations: ['dist/src/database/migrations/*.js'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/database/migrations',
  },
} as TypeOrmModuleOptions;
