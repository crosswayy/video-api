import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/models/user.entity';
import { Repository, TypeORMError } from 'typeorm';

@Injectable({})
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async signup(dto: AuthDto): Promise<UserEntity> {
    // Generate the password hash
    const hash: string = await argon.hash(dto.password);

    try {
      // Save new user into the database
      const user = this.userRepository.create({
        email: dto.email,
        hash,
      });

      // Return the saved user
      const newUser = await this.userRepository.save(user);
      delete newUser.hash;
      return newUser;
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new ForbiddenException('Credentials already taken');
      }

      throw Error();
    }
  }

  signin() {
    return { msg: 'I am signed in' };
  }
}
