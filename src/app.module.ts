import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig = require('../ormconfig');
import { AtGuard } from './auth/common/guards';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import { AllExceptionsFilter } from './filter/filter';
import { join } from 'path';
import 'winston-daily-rotate-file';

@Module({
  imports: [
    AuthModule,
    UserModule,
    VideoModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      ...ormconfig,
      autoLoadEntities: true,
    }),
    WinstonModule.forRoot({
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json(),
      ),

      transports: [
        new transports.DailyRotateFile({
          dirname: join(__dirname, 'logs'),
          filename: 'errors-%DATE%.log',
          datePattern: 'DD-MM-YYYY',
          maxSize: '20m',
          maxFiles: '14d',
          level: 'error',
        }),
        new transports.Console({ level: 'info' }),
      ],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
