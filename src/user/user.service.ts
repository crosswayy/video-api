import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '../entities/user.entity';
import { IUser } from './models/user.interface';
import { from, Observable } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  getUser(id: string): Observable<IUser> {
    return from(this.userRepository.findOne({ id }));
  }

  createUser(user: IUser): Observable<IUser> {
    return from(this.userRepository.save(user));
  }
}
