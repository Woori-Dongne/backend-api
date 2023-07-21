import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from './posts.repository';
import { Posts } from './entities/posts.entity';
import { Pagination } from '../enums';

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostRepository) {}

  async getUserPosts(
    userId: number,
    offset?: number,
    limit?: number,
  ): Promise<Posts[]> {
    const defaultOffset = offset || Pagination.Offset;
    // const defaultOffset = offset ? (offset - 1) * Pagination.Limit : 0;
    const defaultLimit = limit || Pagination.Limit;
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
    limit?: number,
    category?: number,
    sortBy?: string,
  ): Promise<Posts[]> {
    const defaultOffset = offset || Pagination.Offset;
    // const defaultOffset = offset ? (offset - 1) * Pagination.Limit : 0;
    const defaultLimit = limit || Pagination.Limit;

    const posts = await this.postRepository.getPostList(
      regionId,
      defaultOffset,
      defaultLimit,
      category,
      sortBy,
    );

    if (!posts.length) throw new NotFoundException('Resource not found');

    return posts;
  }
}
