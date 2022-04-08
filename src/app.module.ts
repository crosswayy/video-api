import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';

@Module({
  imports: [AuthModule, UserModule, VideoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
