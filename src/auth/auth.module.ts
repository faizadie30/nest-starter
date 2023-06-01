import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { Auth } from './entities/auth.entity';
import { UserHelper } from 'src/helpers/user.helper';
import { GlobalHelper } from 'src/helpers/global.helper';
import { EmailService } from 'src/email/email.service';
import { VerifyService } from 'src/verify/verify.service';
import { Verify } from 'src/verify/entities/verify.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Auth, Verify])],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserHelper,
    GlobalHelper,
    EmailService,
    VerifyService,
  ],
})
export class AuthModule {}
