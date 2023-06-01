import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from 'config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { VerifyModule } from './verify/verify.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    AuthModule,
    ProfileModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
    EmailModule,
    VerifyModule,
  ],
  controllers: [],
  providers: [EmailService],
})
export class AppModule {}
