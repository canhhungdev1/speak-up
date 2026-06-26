import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity('transcripts')
export class Transcript {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  lesson_id: string;

  @ManyToOne(() => Lesson, lesson => lesson.transcripts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @Column({ type: 'float' })
  start_time: number;

  @Column({ type: 'float' })
  end_time: number;

  @Column({ type: 'text' })
  text_content: string;

  @Column({ type: 'int', default: 0 })
  order_index: number;
}
