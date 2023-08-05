import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Posts } from './entities/posts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from './posts.repository';
import { ChattingRoom } from './entities/chattingRoom.entity';
import { ChattingUsers } from './entities/chattingUsers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, ChattingRoom, ChattingUsers])],
  providers: [PostsService, PostRepository],
  controllers: [PostsController],
  exports: [PostRepository],
})
export class PostsModule {}
