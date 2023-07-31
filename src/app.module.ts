import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dirname } from 'path';
import { Users } from './modules/users/entities/user.entity';
import { Friends } from './modules/users/entities/friends.entity';
import { Reports } from './modules/users/entities/report.entity';
import { Regions } from './modules/users/entities/region.entity';
import { PostsModule } from './modules/posts/posts.module';
import { Posts } from './modules/posts/entities/posts.entity';
import { ChattingRoom } from './modules/posts/entities/chattingRoom.entity';
import { ChattingUsers } from './modules/posts/entities/chattingUsers.entity';
import { AuthModule } from './modules/auth/auth.module';
import { SnakeCaseNamingStrategy } from './snake-case-naming-strategy';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [
          Users,
          Friends,
          Reports,
          Regions,
          Posts,
          ChattingRoom,
          ChattingUsers,
        ],
        // entities: [__dirname + '/**/entities/*.entity.ts'], ---------이런식으로경로지정하고 싶은데 잘 안되요...
        // logging: true,
        namingStrategy: new SnakeCaseNamingStrategy(),
        synchronize: true,
      }),
    }),
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    AuthModule,
    UsersModule,
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
