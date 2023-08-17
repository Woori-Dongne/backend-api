import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsGateway } from './events.gateway';
import { Posts } from '../posts/entities/posts.entity';
import { ChattingRoom } from '../posts/entities/chattingRoom.entity';
import { ChattingUsers } from '../posts/entities/chattingUsers.entity';
import { PostsService } from '../posts/posts.service';
import { PostRepository } from '../posts/posts.repository';
import { Users } from '../users/entities/user.entity';
import { UsersRepository } from '../users/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts, ChattingRoom, ChattingUsers, Users]),
  ],
  providers: [EventsGateway, PostsService, PostRepository, UsersRepository],
})
export class EventsModule {}
