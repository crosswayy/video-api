import { IsOptional, IsString } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
