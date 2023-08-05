import { Users } from '../../../modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChattingRoom } from './chattingRoom.entity';

@Entity('chatting_users')
export class ChattingUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chattingRoomId: number;

  @Column()
  userId: number;

  @ManyToOne(() => ChattingRoom, (chattingRoom) => chattingRoom.chattingUsers)
  @JoinColumn({ name: 'chatting_room_id' })
  chattingRoom: ChattingRoom;

  @ManyToOne(() => Users, (user) => user.ChattingUsers)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
