import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, MoreThanOrEqual, Repository } from 'typeorm';
import { Posts } from './entities/posts.entity';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Posts)
    private readonly postRepository: Repository<Posts>,
  ) {}

  async getPostList(
    regionId: number,
    category?: number,
    sortBy?: string,
  ): Promise<Posts[]> {
    const today = new Date();

    const options: FindManyOptions<Posts> = {
      where: { region: { id: regionId } },
      order: {},
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
}
