import { Users } from '../../../modules/users/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChattingRoom } from './chattingRoom.entity';

@Entity('chatting_users')
export class ChattingUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChattingRoom, (ChattingRoom) => ChattingRoom.ChattingUsers)
  @JoinColumn({ name: 'chattingRoom_id' })
  chattingRoom: ChattingRoom;

  @ManyToOne(() => Users, (user) => user.ChattingUsers)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
