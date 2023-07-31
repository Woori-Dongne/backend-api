import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Users } from './user.entity';

@Entity('friends')
@Unique(['userId', 'friendId'])
export class Friends {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  friendId: number;

  @ManyToOne(() => Users, (user) => user.user)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Users, (user) => user.friend)
  @JoinColumn({ name: 'friend_id' })
  friend: Users;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
