import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VideoEntity } from './video.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => VideoEntity, (video) => video.user)
  videos: VideoEntity[];

  @Column({ unique: true })
  email: string;

  @Column()
  hash: string;

  @Column({ default: null })
  hashedRT?: string | null;
}
