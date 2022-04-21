import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { GetCurrentUser, GetCurrentUserId } from '../auth/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multerConfig';
import { UserEntity } from '../entities/user.entity';
import { CreateVideoDto, FileDto, RightsDto } from './dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { VideoEntity } from '../entities/video.entity';

@ApiTags('video')
@ApiBearerAuth()
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  // Get All user's videos
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users videos' })
  @ApiOkResponse({
    description: "User's videos has been got successfully",
    type: [VideoEntity],
  })
  @ApiForbiddenResponse({
    description: 'Videos does not exists',
  })
  getUserVideos(@GetCurrentUserId() userId: string): Promise<VideoEntity[]> {
    return this.videoService.getUserVideos(userId);
  }

  // Get user video
  // @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Video has been loaded',
    type: FileDto,
  })
  @ApiForbiddenResponse({
    description: 'You have not access to this video',
  })
  getVideoById(
    @Res() res,
    @Param('id', new ParseUUIDPipe()) videoId: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.videoService.getVideoById(res, videoId, userId);
  }

  // Get user's video properties
  @Get('/properties/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get video properties by given ID' })
  @ApiOkResponse({
    description: 'Video properties has been loaded.',
    type: VideoEntity,
  })
  @ApiForbiddenResponse({
    description: 'You have not access to this video',
  })
  getVideoPropsById(
    @Param('id', new ParseUUIDPipe()) videoId: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.videoService.getVideoPropsById(videoId, userId);
  }

  // Upload a video
  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiOperation({ summary: 'Upload a video' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to upload',
    type: CreateVideoDto,
  })
  @ApiOkResponse({
    description: 'Video has been uploaded',
    type: VideoEntity,
  })
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a video' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to update',
    type: UpdateVideoDto,
  })
  @ApiOkResponse({
    description: 'Video has been updated',
    type: VideoEntity,
  })
  @ApiForbiddenResponse({
    description: 'You have not access to this video',
  })
  updateVideo(
    @Param('id', new ParseUUIDPipe()) videoId: string,
    @GetCurrentUser() user: UserEntity,
    @Body() dto: UpdateVideoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.videoService.updateVideo(videoId, file, user, dto);
  }

  // Delete video
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a video by given ID' })
  @ApiOkResponse({
    description: 'Video has been deleted',
    type: VideoEntity,
  })
  @ApiForbiddenResponse({
    description: 'You have not access to this video',
  })
  deleteVideo(
    @Param('id', new ParseUUIDPipe()) videoId: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.videoService.deleteVideo(videoId, userId);
  }

  // Share rights
  @Put('share/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Share rights to the video' })
  @ApiBody({
    description: 'User email to share video',
    type: RightsDto,
  })
  @ApiOkResponse({
    description: 'Rights has been shared',
  })
  @ApiForbiddenResponse({
    description: 'You have not access to this video',
  })
  shareRights(
    @Param('id', new ParseUUIDPipe()) videoId: string,
    @GetCurrentUserId() userId: string,
    @Body() dto: RightsDto,
  ) {
    return this.videoService.shareRights(videoId, userId, dto);
  }

  // Delete rights
  @Delete('share/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete rights from the video' })
  @ApiBody({
    description: 'User email to take rights for the video',
    type: RightsDto,
  })
  @ApiOkResponse({
    description: 'Rights has been deleted',
  })
  @ApiForbiddenResponse({
    description: 'You have not access to this video',
  })
  deleteRights(
    @Param('id', new ParseUUIDPipe()) videoId: string,
    @GetCurrentUserId() userId: string,
    @Body() dto: RightsDto,
  ) {
    return this.videoService.deleteRights(videoId, userId, dto);
  }
}
