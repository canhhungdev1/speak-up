import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AudioService } from '../../../../services/audio.service';
import { MainLessonViewComponent } from '../../lesson/components/main-lesson-view/main-lesson-view.component';
import { VocabLessonViewComponent } from '../../lesson/components/vocab-lesson-view/vocab-lesson-view.component';
import { InteractiveTranscriptComponent } from '../../lesson/components/interactive-transcript/interactive-transcript.component';

@Component({
  selector: 'app-learner-set-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MainLessonViewComponent, VocabLessonViewComponent, InteractiveTranscriptComponent],
  templateUrl: './learner-set-detail.component.html',
  styleUrls: ['./learner-set-detail.component.scss']
})
export class LearnerSetDetailComponent implements OnInit, OnDestroy {
  setId: string = '';
  courseId: string = 'mock-1';
  lessonSet: any = null;
  
  lessons: any[] = [];
  activeLesson: any = null;
  transcripts: any[] = [];
  
  currentTime: number = 0;
  private audioSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private audioService: AudioService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['setId']) {
        this.setId = params['setId'];
        this.loadMockData();
      }
    });

    this.audioSub = this.audioService.state$.subscribe(state => {
      this.currentTime = state.currentTime;
    });
  }

  loadMockData() {
    // Giả lập lấy dữ liệu 1 Bộ bài học và danh sách Bài học con (Lessons) bên trong
    this.lessonSet = {
      id: this.setId,
      title: this.setId === 'set-2' ? 'Day 2: Bubba\'s Food' : 'Day 1: A Kiss',
    };

    if (this.setId === 'set-2') {
      this.lessons = [
        { id: 'l-4', title: 'Main Audio', type: 'MAIN', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
        { id: 'l-5', title: 'POV', type: 'POV', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' }
      ];
    } else {
      this.lessons = [
        { id: 'l-1', title: 'Main Audio', type: 'MAIN', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
        { id: 'l-2', title: 'Vocabulary', type: 'VOCAB', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
        { id: 'l-3', title: 'Mini Story', type: 'MINI_STORY', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
      ];
    }

    if (this.lessons.length > 0) {
      this.selectTab(this.lessons[0]);
    }
  }

  selectTab(lesson: any) {
    this.activeLesson = lesson;
    this.loadTranscriptsForActiveLesson();
    
    // Dùng setTimeout để đẩy việc update AudioService sang cycle tiếp theo
    // Giúp Angular Change Detection nhận diện được thay đổi và render AudioPlayer ở layout cha
    setTimeout(() => {
      this.audioService.loadLesson(lesson);
    });
  }

  loadTranscriptsForActiveLesson() {
    if (!this.activeLesson) return;
    const type = this.activeLesson.type;
    
    if (type === 'VOCAB') {
      this.transcripts = [
        { startTime: 0, endTime: 5, textContent: 'Gorgeous - Rất đẹp, lộng lẫy' },
        { startTime: 5, endTime: 10, textContent: 'Ignore - Phớt lờ, không chú ý' },
        { startTime: 10, endTime: 15, textContent: 'Huge - Khổng lồ' },
      ];
    } else if (type === 'MINI_STORY' || type === 'POV') {
      this.transcripts = [
        { startTime: 0, endTime: 5, textContent: 'Carlos buys a new car.' },
        { startTime: 5, endTime: 10, textContent: 'It is a very expensive car.' },
        { startTime: 10, endTime: 15, textContent: 'It is a huge, blue, fast car.' },
        { startTime: 15, endTime: 25, textContent: 'While driving down the street, Carlos sees a girl on a bicycle.' },
        { startTime: 25, endTime: 35, textContent: 'She has long blond hair and is beautiful.' },
      ];
    } else {
      this.transcripts = [
        { startTime: 0, endTime: 0, textContent: 'Carlos buys a new car. It is a very expensive car. It is a huge, blue, fast car.' },
        { startTime: 0, endTime: 0, textContent: 'While driving down the street, Carlos sees a girl on a bicycle. She has long blond hair and is beautiful.' },
      ];
    }
  }

  onSeekTime(time: number) {
    this.audioService.seek(time);
  }

  ngOnDestroy() {
    if (this.audioSub) {
      this.audioSub.unsubscribe();
    }
    // Dọn dẹp Audio player khi thoát khỏi phòng học
    this.audioService.clear();
  }
}
