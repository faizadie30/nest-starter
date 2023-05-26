import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserHelper } from 'src/helpers/user.helper';
import { GlobalHelper } from 'src/helpers/global.helper';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UserHelper, GlobalHelper],
})
export class UsersModule {}
