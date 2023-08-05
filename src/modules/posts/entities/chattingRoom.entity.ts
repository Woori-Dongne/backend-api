import { Users } from '../../../modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChattingUsers } from './chattingUsers.entity';
import { Posts } from './posts.entity';

@Entity('chattingRoom')
export class ChattingRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  deadline: Date;

  @Column()
  hostId: number;

  @OneToMany(() => ChattingUsers, (ChattingUsers) => ChattingUsers.chattingRoom)
  ChattingUsers: ChattingUsers;

  @ManyToOne(() => Users, (user) => user.chattingRoom)
  @JoinColumn({ name: 'host_id' })
  user: Users;

  @OneToOne((type) => Posts, (Posts) => Posts.ChattingRoom, {
    nullable: true,
  })
  @JoinColumn()
  Posts: Posts;
}
