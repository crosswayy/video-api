import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository, TypeORMError } from 'typeorm';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable({})
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async signup(dto: AuthDto): Promise<Tokens> {
    const prevUser = await this.userRepository.findOne({ email: dto.email });
    if (prevUser) throw new ForbiddenException('Credentials already taken');
    // Generate the password hash
    const hash: string = await this.hashData(dto.password);

    try {
      // Save new user into the database
      const user = this.userRepository.create({
        email: dto.email,
        hash,
      });

      const tokens = await this.getTokens(user.id, user.email);

      // Return the user tokens
      await this.userRepository.save(user);
      await this.updateRtHash(user.id, tokens.refresh_token);

      return tokens;
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new ForbiddenException('Credentials already taken');
      }

      throw Error();
    }
  }

  async signin(dto: AuthDto): Promise<Tokens> {
    // Find user by email
    const user = await this.userRepository.findOne({ email: dto.email });
    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials are incorrect');

    // compare passwords
    const pwMatches = await argon.verify(user.hash, dto.password);

    // if password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials are incorrect');

    // send back user tokens
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: string) {
    await this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({ hashedRT: null })
      .where('id = :userId and hashedRT IS NOT NULL', { userId })
      .execute();
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.userRepository.findOne({ id: userId });

    if (!user || !user.hashedRT) throw new ForbiddenException('Access denied');

    const rtMatches = await argon.verify(user.hashedRT, rt);
    if (!rtMatches) throw new ForbiddenException('Access denied | TOKEN');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async hashData(data: string) {
    return argon.hash(data);
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.AT_SECRET,
          expiresIn: 60 * parseInt(<string>process.env.ACCESS_TOKEN_EXP_MIN),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.RT_SECRET,
          expiresIn:
            3600 * 24 * parseInt(<string>process.env.REFRESH_TOKEN_EXP_DAYS),
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);

    await this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({ hashedRT: hash })
      .where('id = :userId', { userId })
      .execute();
  }
}
