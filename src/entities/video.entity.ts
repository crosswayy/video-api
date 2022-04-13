import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('video')
export class VideoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.videos)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  link: string;
}
