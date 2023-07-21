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
  let postRepository: PostRepository;

  beforeEach(async () => {
    mockPostRepository = {
      getUserpost: jest.fn(),
      getPostList: jest.fn(),
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
        role: 'user',
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
        },
      ];

      jest
        .spyOn(mockPostRepository, 'getUserpost')
        .mockResolvedValue(userPosts);

      const result = await service.getUserPosts(userId, offset, limit);

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
        },
      ];

      jest.spyOn(mockPostRepository, 'getPostList').mockResolvedValue(posts);

      const result = await service.getPostList(
        regionId,
        offset,
        limit,
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
});
