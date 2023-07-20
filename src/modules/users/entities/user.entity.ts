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
import { Posts } from '../../../modules/posts/entities/posts.entity';
import { ChattingRoom } from '../../../modules/posts/entities/chattingRoom.entity';
import { ChattingUsers } from '../../../modules/posts/entities/chattingUsers.entity';

@Entity('users')
@Unique(['email'])
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'bigint' })
  kakaoId: string;

  @Column({ type: 'varchar', length: 100, default: null })
  userName: string;

  @Column({ type: 'varchar', length: 100, default: null })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 100, default: null })
  role: string;

  @Column({ default: null })
  regionId: number;

  @Column({ type: 'varchar', length: 2000, default: null })
  imageUrl: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

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
