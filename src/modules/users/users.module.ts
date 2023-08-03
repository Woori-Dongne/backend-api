import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { UsersRepository } from './user.repository';
import { AuthModule } from '../auth/auth.module';
import { Friends } from './entities/friends.entity';
import { Regions } from './entities/region.entity';
import { Reports } from './entities/report.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Friends, Regions, Reports]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
