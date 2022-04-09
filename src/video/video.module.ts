import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoEntity } from './models/video.entity';
import { VideoController } from './video.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VideoEntity])],
  controllers: [VideoController],
})
export class VideoModule {}
