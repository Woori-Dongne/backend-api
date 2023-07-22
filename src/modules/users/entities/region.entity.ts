import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './user.entity';
import { Posts } from '../../../modules/posts/entities/posts.entity';

@Entity('regions')
export class Regions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @OneToMany(() => Users, (Users) => Users.region)
  user: Users[];

  @OneToMany(() => Posts, (Posts) => Posts.region)
  post: Posts[];
}
