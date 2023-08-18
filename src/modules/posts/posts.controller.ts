import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '../auth/security/auth.guard';
import { RequestUser } from '../auth/type/req.interface';
import { UpdatePostDto } from './type/post.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @UseGuards(AuthGuard)
  @Get('user')
  async getUserPost(@Req() req: RequestUser, @Query('offset') offset?: number) {
    const userId = req.user.id;
    return await this.postService.getUserPosts(userId, offset);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getPostList(
    @Req() req: RequestUser,
    @Query('category') category?: number,
    @Query('sortBy') sortBy?: string,
    @Query('offset') offset?: number,
  ) {
    const regionId = req.user.regionId;

    return await this.postService.getPostList(
      regionId,
      offset,
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

  @UseGuards(AuthGuard)
  @Get('/:postId')
  async getPostById(@Req() req: RequestUser, @Param('postId') postId: number) {
    return await this.postService.getPostById(postId);
  }

  @UseGuards(AuthGuard)
  @Patch('/:postId')
  async updatePost(
    @Req() req: RequestUser,
    @Body() postsDto: UpdatePostDto,
    @Param('postId') postId: number,
  ) {
    const userId = req.user.id;

    return await this.postService.updatePost(postsDto, userId, postId);
  }

  @UseGuards(AuthGuard)
  @Delete('/:postId')
  async deletePost(@Req() req: RequestUser, @Param('postId') postId: number) {
    const userId = req.user.id;

    return await this.postService.deletePost(userId, postId);
  }
}
