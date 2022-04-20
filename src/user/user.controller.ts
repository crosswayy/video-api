import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';

import { UserService } from './user.service';
import { GetCurrentUser, GetCurrentUserId } from '../auth/common/decorators';
import { UserEntity } from '../entities/user.entity';
import { EditUserDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get('me')
  getUserInfo(@GetCurrentUser() user: UserEntity) {
    return user;
  }

  @Patch('editData')
  editUserInfo(@GetCurrentUserId() userId: string, @Body() dto: EditUserDto) {
    return this.userService.editUserInfo(userId, dto);
  }
}
