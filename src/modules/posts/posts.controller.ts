import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '../auth/security/auth.guard';
import { RequestUser } from '../auth/type/req.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @UseGuards(AuthGuard)
  @Get('user')
  async getUserPost(
    @Req() req: RequestUser,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
  ) {
    const userId = req.user.id;
    return await this.postService.getUserPosts(userId, offset, limit);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getPostList(
    @Req() req: RequestUser,
    @Query('category') category?: number,
    @Query('sortBy') sortBy?: string,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
  ) {
    const regionId = req.user.regionId;

    return await this.postService.getPostList(
      regionId,
      offset,
      limit,
      category,
      sortBy,
    );
  }

  @UseGuards(AuthGuard)
  @Get('/chattings')
  async getChattingRoomList(@Req() req: RequestUser) {
    const userId = req.user.id;
    return await this.postService.getChattingRoomList(userId);
  }
}
