import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateVideoDto, RightsDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoEntity } from '../entities/video.entity';
import { join } from 'path';
import { UpdateVideoDto } from './dto/update-video.dto';
import * as fs from 'fs';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
  ) {}

  async getUserVideos(userId: string) {
    const videos = await this.videoRepository
      .createQueryBuilder()
      .where('user_id = :userId', { userId })
      .getMany();

    if (!videos.length) throw new NotFoundException('Videos does not exists');

    return videos;
  }

  async getVideoById(res, videoId, userId) {
    if (!videoId) throw new BadRequestException('Video id must be given');

    const access = await this.getAccess(videoId, userId);

    if (!access)
      throw new ForbiddenException('You have not access to this video');

    const video = await this.videoRepository.findOne(videoId);

    if (!video) throw new NotFoundException('Video does not exists');

    return res.sendFile(join(__dirname, `../../../${video.link}`));
  }

  async getVideoPropsById(videoId: string, userId: string) {
    if (!videoId) throw new BadRequestException('Video id must be given');

    const access = await this.getAccess(videoId, userId);
    const videoProps = await this.videoRepository.findOne(videoId);

    if (!access)
      throw new ForbiddenException('You have not access to this video');

    if (!videoProps) throw new NotFoundException('Video does not exists');

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
    if (!videoId) throw new BadRequestException('Video id must be given');

    const video = await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.user', 'videos')
      .where('video.id = :videoId', { videoId })
      .getOne();

    if (!video) throw new NotFoundException('Video does not exists');

    if (video['user'].id != user.id)
      throw new ForbiddenException('You have not access to this video');

    let updateParams: object = dto;
    console.log({ file });
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
    } else delete updateParams['file'];

    const updatedVideo = await this.videoRepository
      .createQueryBuilder()
      .update(VideoEntity)
      .set({ ...updateParams })
      .where('id = :videoId', { videoId })
      .execute();

    return updatedVideo.raw[0];
  }

  async deleteVideo(videoId: string, userId: string) {
    if (!videoId) throw new BadRequestException('Video id must be given');

    const video = await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.user', 'videos')
      .where('video.id = :videoId', { videoId })
      .getOne();

    if (!video) throw new NotFoundException('Video does not exists');

    if (video['user'].id != userId)
      throw new ForbiddenException('You have not access to this video');

    await this.videoRepository.delete(videoId);

    fs.unlink(join(__dirname, `../../../${video['link']}`), (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });

    return video;
  }

  async shareRights(videoId: string, userId: string, email: RightsDto) {
    if (!videoId) throw new BadRequestException('Video id must be given');

    const video = await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.users', 'sharedVideos')
      .leftJoinAndSelect('video.user', 'videos')
      .where('video.id = :videoId', { videoId })
      .getOne();

    if (!video) throw new NotFoundException('Video does not exists');

    if (video['user'].id != userId)
      throw new ForbiddenException('You have not access to this video');

    const userToShare = await this.userRepository.findOne(email);

    if (!userToShare) throw new NotFoundException("User didn't found");

    video.users.find((user) => {
      if (user.id === userToShare.id)
        throw new ForbiddenException(
          'This user already have access to this video',
        );
    });

    video.users = [...video.users, userToShare];

    await this.videoRepository.save(video);

    return {
      msg: 'Rights shared',
    };
  }

  async deleteRights(videoId: string, userId: string, email: RightsDto) {
    if (!videoId) throw new BadRequestException('Video id must be given');

    const video = await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.users', 'sharedVideos')
      .leftJoinAndSelect('video.user', 'videos')
      .where('video.id = :videoId', { videoId })
      .getOne();

    if (!video) throw new NotFoundException('Video does not exists');

    if (video['user'].id != userId)
      throw new ForbiddenException('You have not access to this video');

    const userToShare = await this.userRepository.findOne(email);

    if (!userToShare) throw new ForbiddenException("User didn't found");

    const alreadyHaveAccess = video.users.find((user) => {
      return user.id === userToShare.id;
    });

    if (!alreadyHaveAccess)
      throw new ForbiddenException('This user have not access to this video');

    video.users = video.users.filter((user) => {
      return user.id !== userToShare.id;
    });

    await this.videoRepository.save(video);
  }

  // Get access to video
  getAccess(videoId, userId) {
    return this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.users', 'sharedVideos')
      .leftJoinAndSelect('video.user', 'videos')
      .where('video.id = :videoId', { videoId })
      .andWhere('videos.id = :userId', { userId })
      .orWhere('sharedVideos.id = :userId', { userId })
      .getOne();
  }
}
