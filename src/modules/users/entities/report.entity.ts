import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Users } from './user.entity';

@Entity('reports')
export class Reports {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  friendId: number;

  @Column({ type: 'varchar', length: 500 })
  content: string;

  @ManyToOne(() => Users, (user) => user.report)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Users, (user) => user.attacker)
  @JoinColumn({ name: 'friend_id' })
  friend: Users;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
