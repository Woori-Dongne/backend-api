import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '../auth/security/auth.guard';
import { RequestUser } from '../auth/type/req.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getPostList(
    @Req() req: RequestUser,
    @Query('category') category?: number,
    @Query('sortBy') sortBy?: string,
  ) {
    const regionId = req.user.region.id;

    return await this.postService.getPostList(regionId, category, sortBy);
  }
}
