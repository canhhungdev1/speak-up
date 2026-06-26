import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Profile } from './profile.entity';
import { Lesson } from './lesson.entity';

@Entity('user_progress')
@Unique(['user_id', 'lesson_id'])
export class UserProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Profile;

  @Column({ type: 'uuid' })
  lesson_id: string;

  @ManyToOne(() => Lesson, lesson => lesson.user_progress, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @Column({ type: 'float', default: 0.0 })
  last_position: number;

  @Column({ type: 'boolean', default: false })
  is_completed: boolean;

  @Column({ type: 'int', default: 0 })
  listen_count: number;

  @Column({ type: 'int', default: 0 })
  total_listen_time: number;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  last_listened_at: Date;
}
