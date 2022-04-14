import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateVideoDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoEntity } from '../entities/video.entity';
import { join } from 'path';
import { UpdateVideoDto } from './dto/update-video.dto';
import * as fs from 'fs';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
  ) {}

  async getUserVideos(userId: string) {
    const videos = await this.videoRepository
      .createQueryBuilder()
      .where('user_id = :userId', { userId })
      .getMany();

    if (!videos) throw new ForbiddenException('Videos does not exists');

    return videos;
  }

  async getVideoById(res, videoId) {
    const video = await this.videoRepository.findOne(videoId);

    if (!video) throw new ForbiddenException('Video does not exists');

    console.log(__dirname);
    return res.sendFile(join(__dirname, `../../../${video.link}`));
  }

  async getVideoPropsById(videoId: string) {
    const videoProps = await this.videoRepository.findOne(videoId);

    if (!videoProps) throw new ForbiddenException('Video does not exists');

    return videoProps;
  }

  async uploadVideo(
    file: Express.Multer.File,
    user: UserEntity,
    dto: CreateVideoDto,
  ) {
    const { title, description } = dto;
    const video = this.videoRepository.create({
      title,
      description,
      link: file.path,
      user,
    });
    console.log({ file, dto });

    await this.videoRepository.save(video);
    delete video.user;
    return video;
  }

  async updateVideo(
    videoId: string,
    file: Express.Multer.File,
    user: UserEntity,
    dto: UpdateVideoDto,
  ) {
    const video = await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.user', 'videos')
      .where('video.id = :videoId', { videoId })
      .getOne();

    if (!video) throw new ForbiddenException('Video does not exists');

    if (video['user'].id != user.id)
      throw new ForbiddenException('You have not access to this video');

    let updateParams: object = dto;

    if (file) {
      fs.unlink(join(__dirname, `../../../${video['link']}`), (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });

      updateParams = {
        ...dto,
        link: file.path,
      };
    }

    const updatedVideo = await this.videoRepository
      .createQueryBuilder()
      .update(VideoEntity)
      .set({ ...updateParams })
      .where('id = :videoId', { videoId })
      .execute();

    return updatedVideo.raw[0];
  }

  async deleteVideo(videoId: string, userId: string) {
    const video = await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.user', 'videos')
      .where('video.id = :videoId', { videoId })
      .getOne();

    if (!video) throw new ForbiddenException('Video does not exists');

    if (video['user'].id != userId)
      throw new ForbiddenException('You have not access to this video');

    await this.videoRepository.delete(videoId);

    fs.unlink(join(__dirname, `../../../${video['link']}`), (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });

    return {
      title: video.title,
      status: 'Deleted',
    };
  }
}
