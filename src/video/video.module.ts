import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoEntity } from './models/video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VideoEntity])],
})
export class VideoModule {}
