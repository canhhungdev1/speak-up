import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Profile } from './profile.entity';
import { LessonSet } from './lesson-set.entity';

@Entity('daily_checkins')
@Unique(['user_id', 'lesson_set_id', 'checkin_date'])
export class DailyCheckin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Profile;

  @Column({ type: 'uuid' })
  lesson_set_id: string;

  @ManyToOne(() => LessonSet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_set_id' })
  lesson_set: LessonSet;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  checkin_date: Date;
}
