import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verify } from './entities/verify.entity';
import { VerifyService } from './verify.service';
import { GlobalHelper } from 'src/helpers/global.helper';

@Module({
  imports: [
    TypeOrmModule.forFeature([Verify]),
    JwtModule.register({
      global: true,
      secret: process.env.ACCESS_TOKEN_KEY,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_AGE },
    }),
  ],
  providers: [VerifyService, GlobalHelper],
})
export class VerifyModule {}
