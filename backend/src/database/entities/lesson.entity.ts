import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { LessonSet } from './lesson-set.entity';
import { Transcript } from './transcript.entity';
import { UserProgress } from './user-progress.entity';

export enum LessonType {
  MAIN = 'MAIN',
  VOCAB = 'VOCAB',
  MINI_STORY = 'MINI_STORY',
  POV = 'POV',
}

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  lesson_set_id: string;

  @ManyToOne(() => LessonSet, lessonSet => lessonSet.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_set_id' })
  lesson_set: LessonSet;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'enum', enum: LessonType })
  type: LessonType;

  @Column({ type: 'varchar', length: 1024 })
  audio_url: string;

  @Column({ type: 'int', default: 0 })
  duration_seconds: number;

  @Column({ type: 'int', default: 0 })
  order_index: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @OneToMany(() => Transcript, transcript => transcript.lesson)
  transcripts: Transcript[];

  @OneToMany(() => UserProgress, progress => progress.lesson)
  user_progress: UserProgress[];
}
