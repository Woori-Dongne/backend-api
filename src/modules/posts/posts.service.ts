import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from './posts.repository';
import { Posts } from './entities/posts.entity';
import { Pagination } from '../enums';

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostRepository) {}

  async getUserPosts(userId: number, offset?: number): Promise<Posts[]> {
    // const defaultOffset = offset || Pagination.Offset;
    const defaultOffset = offset ? (offset - 1) * Pagination.Limit : 0;
    const defaultLimit = Pagination.Limit;
    const post = await this.postRepository.getUserpost(
      userId,
      defaultOffset,
      defaultLimit,
    );

    if (!post.length) throw new NotFoundException('Resource not found');

    return post;
  }

  async getPostList(
    regionId: number,
    offset?: number,
    category?: number,
    sortBy?: string,
  ) {
    const defaultOffset = offset ? (offset - 1) * Pagination.Limit : 0;
    const defaultLimit = Pagination.Limit;

    const posts = await this.postRepository.getPostList(
      regionId,
      defaultOffset,
      defaultLimit,
      category,
      sortBy,
    );

    if (!posts.length) throw new NotFoundException('Resource not found');

    const simplifiedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      personnel: post.personnel,
      imageUrl: post.imageUrl,
      deadline: post.deadline,
      category: post.category,
      userId: post.userId,
      detailRegion: post.detailRegion,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      deletedAt: post.deletedAt,
      regionId: post.regionId,
      user: {
        id: post.user.id,
        userName: post.user.userName,
        imageUrl: post.user.imageUrl,
      },
    }));
    return simplifiedPosts;
  }

  async getChattingRoomList(userId: number) {
    const list = await this.postRepository.getChattingRoomList(userId);

    if (list.length === 0) {
      throw new NotFoundException('Resource not found');
    }

    return Promise.all(
      list.map(async (room) => {
        const post = await this.postRepository.getPostByChatRoom(
          room.chattingRoomId,
        );

        return {
          chattingRoomId: room.chattingRoomId,
          isHost: post.userId === userId,
          title: post.title,
          personnel: post.personnel,
          deadline: post.deadline,
          region: post.detailRegion,
        };
      }),
    );
  }
}
