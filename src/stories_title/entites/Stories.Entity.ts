import { CURRENT_TIMESTAMP } from 'src/utils';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('stories')
export class Story {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar' })
  creator: string;
  @Column({ type: 'varchar' })
  title: string;
  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'simple-array' })
  subtitles: string[];

  @Column({ type: 'simple-array' })
  subjects: string[];

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;
}
