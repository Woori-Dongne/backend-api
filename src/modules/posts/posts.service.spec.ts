import { NotFoundException } from '@nestjs/common';
import { Regions } from '../users/entities/region.entity';
import { Users } from '../users/entities/user.entity';
import { Posts } from './entities/posts.entity';
import { PostsService } from './posts.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PostRepository } from './posts.repository';

describe('PostsService', () => {
  let service: PostsService;
  let mockPostRepository: Partial<PostRepository>;

  beforeEach(async () => {
    mockPostRepository = {
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

      const user: Users = {
        id: 1,
        email: 'test@example.com',
        kakaoId: '12345',
        userName: 'TestUser',
        phoneNumber: '010-1234-5678',
        role: 'user',
        created_at: new Date(),
        updatedAt: new Date(),
        region: userRegion,
        user: null,
        friend: null,
        report: null,
        attacker: null,
        post: null,
        chattingRoom: null,
        ChattingUsers: null,
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
          created_at: new Date(),
          updatedAt: new Date(),
          deleted_at: null,
          user: user,
          regionId: 1,
          region: null,
        },
      ];

      jest
        .spyOn(mockPostRepository, 'getPostList')
        .mockResolvedValue(userPosts);

      const result = await service.getPostList(userRegionId, category, sortBy);

      expect(result).toEqual(userPosts);
      expect(mockPostRepository.getPostList).toHaveBeenCalledWith(
        userRegionId,
        category,
        sortBy,
      );
    });

    it('should throw NotFoundException if no user posts found', async () => {
      const category = 1;
      const sortBy = 'deadline';
      const userRegionId = 2;

      jest.spyOn(mockPostRepository, 'getPostList').mockResolvedValue([]);

      await expect(
        service.getPostList(userRegionId, category, sortBy),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
