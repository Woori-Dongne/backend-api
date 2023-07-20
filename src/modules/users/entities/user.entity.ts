import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Friends } from './friends.entity';
import { Reports } from './report.entity';
import { Regions } from './region.entity';

import { ChattingRoom } from '../../../modules/posts/entities/chattingRoom.entity';
import { ChattingUsers } from '../../../modules/posts/entities/chattingUsers.entity';
import { Posts } from '../../../modules/posts/entities/posts.entity';

@Entity('users')
@Unique(['email'])
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ name: 'kakao_id', type: 'bigint' })
  kakaoId: string;

  @Column({ name: 'username', type: 'varchar', length: 100, default: null })
  userName: string;

  @Column({ name: 'phoneNumber', type: 'varchar', length: 100, default: null })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 100, default: null })
  role: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Friends, (Friends) => Friends.user)
  user: Friends;

  @OneToMany(() => Friends, (Friends) => Friends.friend)
  friend: Friends;

  @OneToMany(() => Reports, (Reports) => Reports.user)
  report: Reports;

  @OneToMany(() => Reports, (Reports) => Reports.friend)
  attacker: Reports;

  @OneToMany(() => Posts, (Posts) => Posts.user)
  post: Posts;

  @OneToMany(() => ChattingRoom, (ChattingRoom) => ChattingRoom.user)
  chattingRoom: ChattingRoom;

  @OneToMany(() => ChattingUsers, (ChattingUsers) => ChattingUsers.user)
  ChattingUsers: ChattingUsers;

  @ManyToOne(() => Regions, (Regions) => Regions.user, { nullable: true })
  @JoinColumn({ name: 'region_id' })
  region: Regions;
}
