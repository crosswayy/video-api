import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
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

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'videos_users',
    joinColumn: {
      name: 'video',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user',
      referencedColumnName: 'id',
    },
  })
  users: UserEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  link: string;
}
