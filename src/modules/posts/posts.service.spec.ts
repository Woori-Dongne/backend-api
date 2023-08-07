import { NotFoundException } from '@nestjs/common';
import { Users } from '../users/entities/user.entity';
import { Regions } from '../users/entities/region.entity';
import { Posts } from './entities/posts.entity';
import { PostsService } from './posts.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PostRepository } from './posts.repository';

describe('PostsService', () => {
  let service: PostsService;
  let mockPostRepository: Partial<PostRepository>;

  beforeEach(async () => {
    mockPostRepository = {
      getUserpost: jest.fn(),
      getPostList: jest.fn(),
      getPostByChatRoom: jest.fn(),
      getChattingRoomList: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostRepository,
          useValue: mockPostRepository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPostList', () => {
    it('should return user posts', async () => {
      const category = 1;
      const sortBy = 'deadLine';
      const userRegionId = 2;

      const userRegion: Regions = {
        id: userRegionId,
        name: 'TestRegion',
        user: null,
        post: null,
      };
      const userId = 1;
      const offset = 0;
      const limit = 10;

      const user: Users = {
        id: 1,
        email: 'test@example.com',
        kakaoId: '12345',
        userName: 'TestUser',
        phoneNumber: '010-1234-5678',
        gender: 'F',
        createdAt: new Date(),
        updatedAt: new Date(),
        regionId: null,
        region: userRegion,
        user: null,
        friend: null,
        report: null,
        attacker: null,
        post: null,
        chattingRoom: null,
        ChattingUsers: null,
        imageUrl: null,
      };

      const userPosts: Posts[] = [
        {
          id: 1,
          title: 'Post 1',
          content: 'Content 1',
          personnel: 3,
          category: 1,
          imageUrl: null,
          deadline: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          user: user,
          regionId: 1,
          region: null,
          userId: null,
          detailRegion: '역삼역 2번출구',
          ChattingRoom: null,
        },
      ];

      jest
        .spyOn(mockPostRepository, 'getUserpost')
        .mockResolvedValue(userPosts);

      const result = await service.getUserPosts(userId, offset);

      expect(result).toEqual(userPosts);
      expect(mockPostRepository.getUserpost).toHaveBeenCalledWith(
        userId,
        offset,
        limit,
      );
    });

    it('should throw NotFoundException if no user posts found', async () => {
      const userId = 1;

      jest.spyOn(mockPostRepository, 'getUserpost').mockResolvedValue([]);

      await expect(service.getUserPosts(userId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('getPostList', () => {
    it('should return post list', async () => {
      const regionId = 1;
      const offset = 0;
      const limit = 10;
      const category = 1;
      const sortBy = 'deadline';

      const region: Regions = {
        id: regionId,
        name: 'TestRegion',
        user: null,
        post: null,
      };

      const posts: Posts[] = [
        {
          id: 1,
          title: 'Post 1',
          content: 'Content 1',
          personnel: 3,
          category: 1,
          imageUrl: null,
          deadline: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          user: null,
          regionId: regionId,
          region: region,
          userId: 1,
          detailRegion: '역삼역 2번 출구',
          ChattingRoom: null,
        },
      ];

      jest.spyOn(mockPostRepository, 'getPostList').mockResolvedValue(posts);

      const result = await service.getPostList(
        regionId,
        offset,
        category,
        sortBy,
      );

      expect(result).toEqual(posts);
      expect(mockPostRepository.getPostList).toHaveBeenCalledWith(
        regionId,
        offset,
        limit,
        category,
        sortBy,
      );
    });

    it('should throw NotFoundException if no posts found', async () => {
      const regionId = 1;

      jest.spyOn(mockPostRepository, 'getPostList').mockResolvedValue([]);

      await expect(service.getPostList(regionId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('getChattingRoomList', () => {
    it('should return formatted chatting room list', async () => {
      const userId = 1;
      const room1: any = {
        id: 1,
        chattingRoomId: 1,
        userId: 1,
        chattingRoom: null,
      };

      const rooms = [room1];

      const post1: any = {
        id: 1,
        title: '치킨 드실분',
        content: '금일 오후 9시까지 구합니다.',
        personnel: 4,
        imageUrl:
          'https://cdn.pixabay.com/photo/2019/01/04/04/56/boneless-3912455_1280.jpg',
        deadline: '2023-08-03T15:51:09.000Z',
        category: 1,
        userId: 1,
        detailRegion: '',
        createdAt: '2023-08-03T15:51:09.000Z',
        updatedAt: '2023-08-05T09:31:47.480Z',
        deletedAt: '2023-08-03T15:51:09.000Z',
        regionId: 1,
      };

      const post2: any = {
        id: 1,
        title: '치킨 드실분',
        content: '금일 오후 9시까지 구합니다.',
        personnel: 4,
        imageUrl:
          'https://cdn.pixabay.com/photo/2019/01/04/04/56/boneless-3912455_1280.jpg',
        deadline: '2023-08-03T15:51:09.000Z',
        category: 1,
        userId: 1,
        detailRegion: '',
        createdAt: '2023-08-03T15:51:09.000Z',
        updatedAt: '2023-08-05T09:31:47.480Z',
        deletedAt: '2023-08-03T15:51:09.000Z',
        regionId: 1,
      };

      jest
        .spyOn(mockPostRepository, 'getChattingRoomList')
        .mockResolvedValue(rooms);
      jest
        .spyOn(mockPostRepository, 'getPostByChatRoom')
        .mockResolvedValueOnce(post1);

      const expectedFormattedRooms = [
        {
          chattingRoomId: room1.chattingRoomId,
          isHost: true,
          title: post1.title,
          personnel: post1.personnel,
          deadline: post1.deadline,
          region: post1.detailRegion,
        },
      ];

      const result = await service.getChattingRoomList(userId);

      expect(result).toEqual(expectedFormattedRooms);
      expect(mockPostRepository.getChattingRoomList).toHaveBeenCalledWith(
        userId,
      );
      expect(mockPostRepository.getPostByChatRoom).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.getPostByChatRoom).toHaveBeenCalledWith(
        room1.chattingRoomId,
      );
    });
  });
});
