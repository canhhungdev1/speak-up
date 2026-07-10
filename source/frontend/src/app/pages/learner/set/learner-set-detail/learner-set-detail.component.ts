import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AudioService } from '../../../../services/audio.service';
import { LessonSetService } from '../../../../services/lesson-set.service';
import { MainLessonViewComponent } from '../../lesson/components/main-lesson-view/main-lesson-view.component';
import { VocabLessonViewComponent } from '../../lesson/components/vocab-lesson-view/vocab-lesson-view.component';
import { InteractiveTranscriptComponent } from '../../lesson/components/interactive-transcript/interactive-transcript.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-learner-set-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MainLessonViewComponent, VocabLessonViewComponent, InteractiveTranscriptComponent, TranslateModule],
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
    private audioService: AudioService,
    private lessonSetService: LessonSetService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['setId']) {
        this.setId = params['setId'];
        this.loadData();
      }
    });

    this.audioSub = this.audioService.state$.subscribe(state => {
      this.currentTime = state.currentTime;
    });
  }

  loadData() {
    this.lessonSetService.getLessonSetById(this.setId).subscribe(set => {
      this.lessonSet = set;
      this.courseId = set.courseId; // Cập nhật courseId từ db
      this.lessons = set.lessons || [];
      if (this.lessons.length > 0) {
        this.selectTab(this.lessons[0]);
      }
    });
  }

  selectTab(lesson: any) {
    this.activeLesson = lesson;
    this.transcripts = lesson.transcripts || [];
    
    // Dùng setTimeout để đẩy việc update AudioService sang cycle tiếp theo
    // Giúp Angular Change Detection nhận diện được thay đổi và render AudioPlayer ở layout cha
    setTimeout(() => {
      this.audioService.loadLesson(lesson);
    });
  }

  onSeekTime(time: number) {
    this.audioService.seek(time);
  }

  getTabLabel(lesson: any): string {
    const type = lesson.type;
    const sameTypeLessons = this.lessons.filter(l => l.type === type);
    
    let baseLabel = '';
    switch (type) {
      case 'MAIN':
        baseLabel = this.translate.instant('SET_DETAIL.MAIN_ARTICLE');
        break;
      case 'VOCAB':
        baseLabel = this.translate.instant('SET_DETAIL.VOCABULARY');
        break;
      case 'MINI_STORY':
        baseLabel = this.translate.instant('SET_DETAIL.MINI_STORY');
        break;
      case 'POV':
        baseLabel = this.translate.instant('SET_DETAIL.POINT_OF_VIEW');
        break;
      default:
        baseLabel = type;
    }
    
    if (sameTypeLessons.length <= 1) {
      return baseLabel;
    }
    
    const index = sameTypeLessons.findIndex(l => l.id === lesson.id);
    const letter = String.fromCharCode(65 + index); // Tạo chữ cái A, B, C...
    return `${baseLabel} ${letter}`;
  }

  ngOnDestroy() {
    if (this.audioSub) {
      this.audioSub.unsubscribe();
    }
    // Dọn dẹp Audio player khi thoát khỏi phòng học
    this.audioService.clear();
  }
}
