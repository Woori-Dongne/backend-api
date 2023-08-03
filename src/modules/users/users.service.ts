import { Injectable } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { UpdateUserInfoDTO } from './dto/user.dto';
import { Users } from './entities/user.entity';
import { Regions } from './entities/region.entity';
import { ChattingRoom } from '../posts/entities/chattingRoom.entity';
import { ChattingUsers } from '../posts/entities/chattingUsers.entity';
import { Posts } from '../posts/entities/posts.entity';
import { Friends } from './entities/friends.entity';
import { CreateReportDto } from './dto/report.dto';
import { Reports } from './entities/report.entity';
import { Profile } from './type/profile.type';
import { FriendsDto } from './dto/friends.dto';
import { Friend } from './type/friendList.type';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async updateUserInfo(
    userId: number,
    updateUserInfoDTO: UpdateUserInfoDTO,
  ): Promise<Users> {
    const region = await this.usersRepository.checkRegion(
      updateUserInfoDTO.region,
    );

    return await this.usersRepository.updateUserInfo(
      userId,
      updateUserInfoDTO,
      region,
    );
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

  async createReport(
    userId: number,
    createReportDto: CreateReportDto,
  ): Promise<Reports> {
    return await this.usersRepository.createReport(userId, createReportDto);
  }

  async following(friendsDto: FriendsDto) {
    return await this.usersRepository.following(friendsDto);
  }

  async unfollowing(friendsDto: FriendsDto) {
    return await this.usersRepository.unfollowing(friendsDto);
  }

  async getFriendList(userId: number): Promise<Friend[]> {
    const followList = await this.usersRepository.getFriendsByUserId(userId);
    const friendIdList = followList.map((friend) => friend.friendId);

    return await this.usersRepository.getUserNamesByFriendIds(friendIdList);
  }
}
