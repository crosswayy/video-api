import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';

import { UserEntity } from '../entities/user.entity';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async editUserInfo(userId: string, dto: EditUserDto) {
    type UpdateInfo = {
      hash?: string;
      email?: string;
    };

    const isUsedEmail = await this.userRepository.findOne({ email: dto.email });

    if (isUsedEmail) throw new ForbiddenException('This email is already used');

    const updateInfo: UpdateInfo = {};

    if (dto.password) {
      dto.password = await argon.hash(dto.password);
      updateInfo.hash = dto.password;
    }

    if (dto.email) {
      updateInfo.email = dto.email;
    }

    const updatedData = await this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({ ...updateInfo })
      .where('id = :userId', { userId })
      .returning(['id', 'email'])
      .execute();

    const user = updatedData.raw[0];
    return user;
  }
}
