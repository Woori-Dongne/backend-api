import { Users } from '../../../modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column({ name: 'imageUrl', type: 'varchar', length: 2000, default: null })
  imageUrl: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  deadline: Date;

  @Column({ type: 'int' })
  category: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  deleted_at: Date;

  @ManyToOne(() => Users, (user) => user.post)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
