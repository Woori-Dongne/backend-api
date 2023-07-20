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
import { Posts } from 'src/modules/posts/entities/posts.entity';
import { ChattingRoom } from 'src/modules/posts/entities/chattingRoom.entity';
import { ChattingUsers } from 'src/modules/posts/entities/chattingUsers.entity';

@Entity('users')
@Unique(['email'])
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ name: 'kakao_id', type: 'bigint' })
  kakaoId: string;

  @Column({ name: 'username', type: 'varchar', length: 100 })
  userName: string;

  @Column({ name: 'phoneNumber', type: 'varchar', length: 100 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 100 })
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

  @ManyToOne(() => Regions, (Regions) => Regions.user)
  @JoinColumn({ name: 'region_id' })
  region: Regions;
}
