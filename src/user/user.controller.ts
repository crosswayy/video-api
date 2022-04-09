import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Observable } from 'rxjs';

import { UserService } from './user.service';
import { IUser } from './models/user.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  get(@Param('id') id: string): Observable<IUser> {
    return this.userService.getUser(id);
  }

  @Post()
  create(@Body() user: IUser): Observable<IUser> {
    return this.userService.createUser(user);
  }
}
