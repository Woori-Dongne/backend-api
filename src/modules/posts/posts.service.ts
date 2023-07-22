import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from './posts.repository';
import { Posts } from './entities/posts.entity';

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostRepository) {}

  async getPostList(
    regionId: number,
    category: number,
    sortBy: string,
  ): Promise<Posts[]> {
    const posts = await this.postRepository.getPostList(
      regionId,
      category,
      sortBy,
    );

    if (!posts.length) throw new NotFoundException('Resource not found');

    return posts;
  }
}
