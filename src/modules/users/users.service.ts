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
import { Profile } from './type/profile.type';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async updateUserInfo(
    userId: number,
    updateUserInfoDTO: UpdateUserInfoDTO,
  ): Promise<Users> {
    return this.usersRepository.updateUserInfo(userId, updateUserInfoDTO);
  }

  async findUserById(friendId: number, userId: number): Promise<Profile> {
    const user = await this.usersRepository.findUserById(friendId);
    const follow = await this.usersRepository.isfollowing(friendId, userId);
    const profile: Profile = {
      id: user.id,
      userName: user.userName,
      imageUrl: user.imageUrl,
      follow,
    };

    return profile;
  }
}
