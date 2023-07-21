import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { RequestUser } from '../auth/type/req.interface';

const mockUserPosts = [
  {
    id: 1,
    title: 'Post 1',
    content: 'Content 1',
    personnel: 3,
    imageUrl: null,
    deadline: new Date(),
    category: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];

const mockPosts = [
  {
    id: 19,
    title: 'so',
    content: null,
    personnel: 4,
    imageUrl: null,
    deadline: '2023-10-11T15:00:00.000Z',
    category: 3,
    createdAt: null,
    updatedAt: null,
    deletedAt: null,
  },
];

class PostsServiceMock {
  async getUserPosts(userId: number, offset?: number, limit?: number) {
    return mockUserPosts;
  }

  async getPostList(
    regionId?: number,
    category?: number,
    sortBy?: string,
    offset?: number,
    limit?: number,
  ) {
    return mockPosts;
  }
}

describe('PostsController', () => {
  let controller: PostsController;
  let postsService: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useClass: PostsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get post list with correct parameters', async () => {
    const category = 3;
    const sortBy = 'deadLine';
    const regionId = 1;

    const expectedResult = mockPosts;

    const req = {
      user: {
        region: {
          id: regionId,
          user: null,
          post: null,
          name: null,
        },
      },
    } as RequestUser; // RequestUser로 타입 캐스팅

    const result = await controller.getPostList(req, category, sortBy);

    expect(result).toEqual(expectedResult);
  });
  describe('getUserPost', () => {
    it('should get user posts with correct parameters', async () => {
      const userId = 1;
      const userPosts = [
        {
          id: 19,
          title: 'so',
          content: null,
          personnel: 4,
          imageUrl: null,
          deadline: null,
          category: 3,
          createdAt: null,
          updatedAt: null,
          deletedAt: null,
          user: null,
          region: null,
          userId: null,
          regionId: null,
        },
      ];

      const offset = 0;
      const limit = 10;

      const expectedResult = mockUserPosts;

      const req = {
        user: {
          id: userId,
        },
      } as RequestUser;

      const result = await controller.getUserPost(req, offset, limit);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getPostList', () => {
    it('should get post list with correct parameters', async () => {
      const category = 3;
      const sortBy = 'deadLine';
      const regionId = 1;

      const expectedResult = mockPosts;

      const req = {
        user: {
          region: {
            id: regionId,
            user: null,
            post: null,
            name: null,
          },
        },
      } as RequestUser;

      const result = await controller.getPostList(req, category, sortBy);

      expect(result).toEqual(expectedResult);
    });
  });
});
