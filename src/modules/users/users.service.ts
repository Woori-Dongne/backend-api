import { Injectable } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { UpdateUserInfoDTO } from './dto/user.dto';
import { Users } from './entities/user.entity';
import { Regions } from './entities/region.entity';
import { ChattingRoom } from '../posts/entities/chattingRoom.entity';
import { ChattingUsers } from '../posts/entities/chattingUsers.entity';
import { Posts } from '../posts/entities/posts.entity';
import { Friends } from './entities/friends.entity';
import { Reports } from './entities/report.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async updateUserInfo(
    userId: number,
    updateUserInfoDTO: UpdateUserInfoDTO,
  ): Promise<Users> {
    return this.usersRepository.updateUserInfo(userId, updateUserInfoDTO);
  }
}
