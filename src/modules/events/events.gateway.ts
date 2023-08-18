import {
  BadRequestException,
  Logger,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { PostRepository } from '../posts/posts.repository';
import { CreateChattingPostDto, JoinChattingRoomDto } from './dto/events.dto';
import { RequestUser } from '../auth/type';
import { ConfigService } from '@nestjs/config';

interface MessagePayload {
  roomName: string;
  message: string;
}

@WebSocketGateway({
  namespace: 'chat',
  cors: true,
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly postRepository: PostRepository,
    private readonly configService: ConfigService,
  ) {}

  private logger = new Logger('Gateway');

  @WebSocketServer() nsp: Namespace;

  afterInit() {
    //초기화 이후 작업이 있을 수 있어서 아래 주석은 일단 남겨두겠습니다.
    // this.nsp.adapter.on('delete-room', (room) => {
    //   const deletedRoom = createdRooms.find(
    //     (createdRoom) => createdRoom === room,
    //   );
    //   if (!deletedRoom) return;

    //   this.nsp.emit('delete-room', deletedRoom);

    // });

    this.logger.log('웹소켓 서버 초기화 ✅');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결`);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결 해제 ❌`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { roomName, message }: MessagePayload,
  ) {
    const accessToken = socket.handshake.headers.authorization.split(' ')[1];
    const payload = jwt.verify(
      accessToken,
      this.configService.get('SECRET_KEY'),
    );
    const userId = payload['userId'];

    const chattingUser = await this.postRepository.getChattingUser(
      roomName,
      userId,
    );

    socket.broadcast
      .to(roomName)
      .emit('message', {
        userId,
        username: chattingUser.user.userName,
        message,
      });

    return { userId, username: chattingUser.user.userName, message };
  }

  @SubscribeMessage('create-room')
  async handleCreateRoom(
    @ConnectedSocket() socket: Socket,
    @Req() req: RequestUser,
    @MessageBody() body: CreateChattingPostDto,
  ) {
    const accessToken = socket.handshake.headers.authorization.split(' ')[1];
    const payload = jwt.verify(
      accessToken,
      this.configService.get('SECRET_KEY'),
    );
    const userId = payload['userId'];
    const { post, chattingRoom } = await this.postRepository.createChattingPost(
      body,
      userId,
    );

    socket.join(chattingRoom.roomName);
    // this.nsp.emit('create-room', chattingRoom.roomName); // 대기실 방 생성

    return {
      success: true,
      title: post.title,
      roomName: chattingRoom.roomName,
    };
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: JoinChattingRoomDto,
  ) {
    this.logger.log('방에 참가');
    const accessToken = socket.handshake.headers.authorization.split(' ')[1];
    const payload = jwt.verify(
      accessToken,
      this.configService.get('SECRET_KEY'),
    );
    const userId = payload['userId'];

    const post = await this.postRepository.getPostByChatRoomName(body.roomName);

    if (post.personnel === post.chattingRoom.chattingUsers.length) {
      throw new BadRequestException('채팅방 참여 인원을 초과 했습니다.');
    }

    let joinedChattingUser = await this.postRepository.getChattingUser(
      body.roomName,
      userId,
    );
    socket.join(body.roomName); // join room

    if (!joinedChattingUser) {
      joinedChattingUser = await this.postRepository.joinChattingRoom(
        post.chattingRoom.id,
        userId,
      );
      socket.broadcast.to(body.roomName).emit('message', {
        message: `${joinedChattingUser.user.userName}가 들어왔습니다.`,
      });
    }
    return { success: true, title: post.title };
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomName: string,
  ) {
    const accessToken = socket.handshake.headers.authorization.split(' ')[1];
    const payload = jwt.verify(
      accessToken,
      this.configService.get('SECRET_KEY'),
    );
    const userId = payload['userId'];
    const chattingUser = await this.postRepository.getChattingUser(
      roomName,
      userId,
    );

    if (!chattingUser)
      throw new BadRequestException('채팅방에 참여 중인 사용자가 아닙니다.');
    await this.postRepository.leaveChattingRoom(roomName, userId);

    socket.leave(roomName); // leave room
    socket.broadcast.to(roomName).emit('message', {
      message: `${chattingUser.user.userName}가 나갔습니다.`,
    });

    return { success: true };
  }
}
