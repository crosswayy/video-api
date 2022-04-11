import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('video')
export class VideoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  link: string;
}
