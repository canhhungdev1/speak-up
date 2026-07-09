import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AudioService } from '../../../../services/audio.service';
import { MainLessonViewComponent } from '../components/main-lesson-view/main-lesson-view.component';
import { VocabLessonViewComponent } from '../components/vocab-lesson-view/vocab-lesson-view.component';
import { InteractiveTranscriptComponent } from '../components/interactive-transcript/interactive-transcript.component';

@Component({
  selector: 'app-learner-lesson-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MainLessonViewComponent, VocabLessonViewComponent, InteractiveTranscriptComponent],
  templateUrl: './learner-lesson-detail.component.html',
  styleUrls: ['./learner-lesson-detail.component.scss']
})
export class LearnerLessonDetailComponent implements OnInit, OnDestroy {
  lessonId: string = '';
  courseId: string = 'mock-1'; // Temporary for mock navigation
  lesson: any = null;
  transcripts: any[] = [];
  
  currentTime: number = 0;
  private audioSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private audioService: AudioService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['lessonId']) {
        this.lessonId = params['lessonId'];
        this.loadMockData();
      }
    });

    // Subscribe to audio time for interactive transcript
    this.audioSub = this.audioService.state$.subscribe(state => {
      this.currentTime = state.currentTime;
    });
  }

  loadMockData() {
    // Generate Mock Lesson
    // Extract type from ID for demo purpose
    let type = 'MAIN';
    if (this.lessonId.includes('vocab')) type = 'VOCAB';
    if (this.lessonId.includes('mini')) type = 'MINI_STORY';

    this.lesson = {
      id: this.lessonId,
      title: 'A Kiss - ' + type,
      type: type,
      audioUrl: 'https://archive.org/download/flow-english/Baseball%20Pig%20Audio.mp3',
    };

    // Auto Play on enter room
    this.audioService.playLesson(this.lesson);

    // Generate Mock Transcripts based on Type
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
      // MAIN
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
  }
}
