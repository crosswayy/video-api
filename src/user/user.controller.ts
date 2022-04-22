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
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponse({ description: 'User info has been got' })
  getUserInfo(@GetCurrentUser() user: UserEntity) {
    return user;
  }

  @Patch('editData')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    description: 'Options to change',
    type: EditUserDto,
  })
  @ApiOkResponse({ description: 'Options successfully changed' })
  @ApiForbiddenResponse({ description: 'This email already in use' })
  editUserInfo(@GetCurrentUserId() userId: string, @Body() dto: EditUserDto) {
    return this.userService.editUserInfo(userId, dto);
  }
}
