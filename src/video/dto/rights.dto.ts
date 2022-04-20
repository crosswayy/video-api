import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RightsDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
