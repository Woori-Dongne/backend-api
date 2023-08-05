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
    detailRegion: '역삼역',
  },
];
const mockChattingRooms = [
  {
    chattingRoomId: 1,
    deadline: new Date(),
    isHost: true,
    personnel: 3,
    region: 'Detail Region 1',
    title: 'Post 1',
  },
  {
    chattingRoomId: 2,
    deadline: new Date(),
    isHost: false,
    personnel: 5,
    region: 'Detail Region 2',
    title: 'Post 2',
  },
];

const mockChattingRoomsWithPosts = [
  {
    chattingRoomId: 1,
    post: {
      userId: 1,
      title: 'Post 1',
      personnel: 3,
      deadline: new Date(),
      detailRegion: 'Detail Region 1',
    },
  },
  {
    chattingRoomId: 2,
    post: {
      userId: 2,
      title: 'Post 2',
      personnel: 5,
      deadline: new Date(),
      detailRegion: 'Detail Region 2',
    },
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

  async getChattingRoomList(userId: number) {
    return mockChattingRooms;
  }

  async getPostByChatRoom(chattingRoomId: number) {
    return mockChattingRoomsWithPosts.find(
      (room) => room.chattingRoomId === chattingRoomId,
    ).post;
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
    } as RequestUser;

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
          detailRegion: '역삼역 ',
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
  it('should get chatting room list with correct user', async () => {
    const userId = 1;
    const expectedResult = [
      {
        chattingRoomId: mockChattingRoomsWithPosts[0].chattingRoomId,
        isHost: true,
        title: mockChattingRoomsWithPosts[0].post.title,
        personnel: mockChattingRoomsWithPosts[0].post.personnel,
        deadline: mockChattingRoomsWithPosts[0].post.deadline,
        region: mockChattingRoomsWithPosts[0].post.detailRegion,
      },
      {
        chattingRoomId: mockChattingRoomsWithPosts[1].chattingRoomId,
        isHost: false,
        title: mockChattingRoomsWithPosts[1].post.title,
        personnel: mockChattingRoomsWithPosts[1].post.personnel,
        deadline: mockChattingRoomsWithPosts[1].post.deadline,
        region: mockChattingRoomsWithPosts[1].post.detailRegion,
      },
    ];

    const req = {
      user: {
        id: userId,
      },
    } as RequestUser;

    const result = await controller.getChattingRoomList(req);

    expect(result).toEqual(expectedResult);
  });
});
