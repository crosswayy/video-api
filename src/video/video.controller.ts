import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VideoService } from './video.service';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from '../auth/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multerConfig';
import { UserEntity } from '../entities/user.entity';
import { CreateVideoDto } from './dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  // Get All user's videos
  @Get()
  getUserVideos(@GetCurrentUserId() userId: string) {
    return this.videoService.getUserVideos(userId);
  }

  // Get user video
  // @Public()
  @Get(':id')
  getVideoById(
    @Res() res,
    @Param('id') videoId: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.videoService.getVideoById(res, videoId, userId);
  }

  // Get user's video properties
  @Get('/properties/:id')
  getVideoPropsById(
    @Param('id') videoId: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.videoService.getVideoPropsById(videoId, userId);
  }

  // Upload a video
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @GetCurrentUser() user: UserEntity,
    @Body() dto: CreateVideoDto,
  ) {
    return this.videoService.uploadVideo(file, user, dto);
  }

  // Update video
  @Post('update/:id')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  updateVideo(
    @Param('id') videoId: string,
    @GetCurrentUser() user: UserEntity,
    @Body() dto: UpdateVideoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.videoService.updateVideo(videoId, file, user, dto);
  }

  // Delete video
  @Delete(':id')
  deleteVideo(
    @Param('id') videoId: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.videoService.deleteVideo(videoId, userId);
  }

  // Share rights
  @Put('share/:id')
  shareRights(
    @Param('id') videoId: string,
    @GetCurrentUserId() userId: string,
    @Body() email: string,
  ) {
    return this.videoService.shareRights(videoId, userId, email);
  }

  // Delete rights
  @Delete('share/:id')
  deleteRights(
    @Param('id') videoId: string,
    @GetCurrentUserId() userId: string,
    @Body() email: string,
  ) {
    return this.videoService.deleteRights(videoId, userId, email);
  }
}
