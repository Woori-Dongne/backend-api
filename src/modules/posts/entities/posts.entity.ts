import { Regions } from '../../../modules/users/entities/region.entity';
import { Users } from '../../../modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChattingRoom } from './chattingRoom.entity';

@Entity('posts')
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ name: 'content', type: 'varchar', default: null, length: 1000 })
  content: string;

  @Column({ name: 'personnel', type: 'int' })
  personnel: number;

  @Column({ type: 'varchar', length: 2000, default: null })
  imageUrl: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  deadline: Date;

  @Column({ type: 'int' })
  category: number;

  @Column()
  userId: number;

  @Column({ type: 'varchar', length: 100 })
  detailRegion: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  deletedAt: Date;

  @ManyToOne(() => Users, (user) => user.post)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column()
  regionId: number;

  @ManyToOne(() => Regions, (Regions) => Regions.post)
  @JoinColumn({ name: 'region_id' })
  region: Regions;

  @OneToOne((type) => ChattingRoom, (chattingRoom) => chattingRoom.posts)
  chattingRoom: ChattingRoom;
}
