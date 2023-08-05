import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, MoreThanOrEqual, Repository } from 'typeorm';
import { Posts } from './entities/posts.entity';
import { ChattingUsers } from './entities/chattingUsers.entity';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>,
    @InjectRepository(ChattingUsers)
    private readonly chattingUsersRepository: Repository<ChattingUsers>,
  ) {}

  async getUserpost(
    userId: number,
    offset: number,
    limit: number,
  ): Promise<Posts[] | null> {
    return await this.postRepository.find({
      where: { user: { id: userId } },
      take: limit,
      skip: offset,
    });
  }

  async getPostList(
    regionId: number,
    offset: number,
    limit: number,
    category?: number,
    sortBy?: string,
  ): Promise<Posts[]> {
    const today = new Date();

    const options: FindManyOptions<Posts> = {
      where: { region: { id: regionId } },
      order: {},
      take: limit,
      skip: offset,
    };

    if (category) {
      options.where['category'] = category;
    }

    switch (sortBy) {
      case 'deadLine':
        options.order = { deadline: 'ASC' };
        options.where = { deadline: MoreThanOrEqual(today) };
        break;
      default:
        options.order = { createdAt: 'DESC' };
        break;
    }

    return await this.postRepository.find(options);
  }

  getPostByChatRoom = async (chatRoomId: number) => {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .innerJoin('post.ChattingRoom', 'chattingRoom')
      .where('chattingRoom.id = :chatRoomId', { chatRoomId })
      .getOne();

    return post;
  };

  getChattingRoomList = async (userId: number) => {
    const chattingRoom = await this.chattingUsersRepository.find({
      where: { userId },
      relations: ['chattingRoom'],
    });

    return chattingRoom;
  };
}
