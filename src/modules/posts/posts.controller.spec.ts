import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { RequestUser } from '../auth/type/req.interface';
// Mock 데이터
const mockPosts = [
  {
    id: 19,
    title: 'so',
    content: null,
    personnel: 4,
    imageUrl: null,
    deadline: '2023-10-11T15:00:00.000Z',
    category: 3,
    created_at: '2023-07-25T06:29:50.000Z',
    updatedAt: '2023-07-25T06:29:50.474Z',
    deleted_at: '2023-07-25T06:29:50.000Z',
  },
];

class PostsServiceMock {
  async getPostList(regionId?: number, category?: number, sortBy?: string) {
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
});
