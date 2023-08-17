import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, MoreThanOrEqual, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Posts } from './entities/posts.entity';
import { ChattingUsers } from './entities/chattingUsers.entity';
import { ChattingRoom } from './entities/chattingRoom.entity';
import { CreateChattingPostDto } from '../events/dto/events.dto';
import { Users } from '../users/entities/user.entity';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>,
    @InjectRepository(ChattingUsers)
    private readonly chattingUsersRepository: Repository<ChattingUsers>,
    @InjectRepository(ChattingRoom)
    private readonly chattingRoomRepository: Repository<ChattingRoom>,
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
      relations: ['user', 'chattingRoom'],
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

  getPostByChatRoom = async (chatRoomId: number): Promise<Posts> => {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .innerJoin('post.ChattingRoom', 'chattingRoom')
      .where('chattingRoom.id = :chatRoomId', { chatRoomId })
      .getOne();

    return post;
  };

  getPostByChatRoomName = async (roomName: string): Promise<Posts> => {
    const post = await this.postRepository.findOne({
      relations: ['chattingRoom.chattingUsers'],
      where: { chattingRoom: { roomName: roomName } },
    });

    return post;
  };

  getChattingRoomList = async (userId: number) => {
    const chattingRoom = await this.chattingUsersRepository.find({
      where: { userId },
      relations: ['chattingRoom'],
    });

    return chattingRoom;
  };

  checkChattingRoom = async (roomName: string): Promise<boolean> => {
    const chattingRoom = await this.chattingRoomRepository.findOne({
      where: { roomName: roomName },
    });

    return !!chattingRoom?.id;
  };

  createChattingPost = async (
    body: CreateChattingPostDto,
    userId: number,
    regionId: number,
  ) => {
    const post = new Posts();
    const chattingRoom = new ChattingRoom();
    const chattingUser = new ChattingUsers();

    post.title = body.title;
    post.content = body.content;
    post.personnel = body.personnel;
    post.imageUrl = body.imageUrl;
    post.deadline = body.deadline;
    post.category = body.category;
    post.regionId = regionId;
    post.detailRegion = body.detailRegion;
    post.userId = userId;

    await this.postRepository.save(post);

    chattingRoom.roomName = uuid();
    chattingRoom.deadline = body.deadline;
    chattingRoom.hostId = userId;
    chattingRoom.postId = post.id;

    await this.chattingRoomRepository.save(chattingRoom);

    chattingUser.chattingRoomId = chattingRoom.id;
    chattingUser.userId = userId;

    await this.chattingUsersRepository.save(chattingUser);

    return { post, chattingRoom };
  };

  joinChattingRoom = async (chattingRoomId: number, userId: number) => {
    const chattingUser = new ChattingUsers();

    chattingUser.chattingRoomId = chattingRoomId;
    chattingUser.userId = userId;

    await this.chattingUsersRepository.save(chattingUser);

    const joinedChattingUser = await this.chattingUsersRepository.findOne({
      relations: ['user'],
      where: { userId: userId, chattingRoomId: chattingRoomId },
    });

    return joinedChattingUser;
  };

  getChattingUser = async (roomName: string, userId: number) => {
    const chattingUser = await this.chattingUsersRepository.findOne({
      relations: ['user'],
      where: { chattingRoom: { roomName: roomName }, userId: userId },
    });

    return chattingUser;
  };

  leaveChattingRoom = async (roomName: string, userId: number) => {
    await this.chattingRoomRepository.delete({
      roomName: roomName,
      user: { id: userId },
    });
  };

  getPostById = async (postId: number): Promise<Posts> => {
    return await this.postRepository.findOne({ where: { id: postId } });
  };
}
