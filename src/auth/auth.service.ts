import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
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

  async signin(dto: AuthDto) {
    // Find user by email
    const user = await this.userRepository.findOne({ email: dto.email });
    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials are incorrect');
    // compare passwords
    const pwMatches = await argon.verify(user.hash, dto.password);
    // if password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials are incorrect');
    // send back user
    delete user.hash;
    return user;
  }
}
