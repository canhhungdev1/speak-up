import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CourseService } from '../../../../services/course.service';
import { LessonSetService, LessonSet } from '../../../../services/lesson-set.service';
import { AudioService } from '../../../../services/audio.service';

@Component({
  selector: 'app-learner-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './learner-course-detail.component.html',
  styleUrls: ['./learner-course-detail.component.scss']
})
export class LearnerCourseDetailComponent implements OnInit {
  courseId: string = '';
  course: any = null;
  lessonSets: LessonSet[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private lessonSetService: LessonSetService,
    private audioService: AudioService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.courseId = params['id'];
        this.loadData();
      }
    });
  }

  loadData() {
    // MOCK DATA for preview
    this.course = {
      id: this.courseId,
      title: this.courseId === 'mock-2' ? 'Power English Now' : 'Original Effortless English',
      description: 'Đây là dữ liệu giả lập để bạn trải nghiệm giao diện.',
      coverImageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600',
    };
    
    this.lessonSets = [
      {
        id: 'set-1', courseId: this.courseId, title: 'Day 1: A Kiss', description: 'Carlos mua xe mới.', orderIndex: 1, requiredDays: 0,
        lessons: [
          { id: 'l-1-main', lessonSetId: 'set-1', title: 'A Kiss - Main Audio', type: 'MAIN', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', orderIndex: 1 },
          { id: 'l-1-vocab', lessonSetId: 'set-1', title: 'A Kiss - Vocabulary', type: 'VOCAB', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', orderIndex: 2 },
          { id: 'l-1-mini', lessonSetId: 'set-1', title: 'A Kiss - Mini Story', type: 'MINI_STORY', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', orderIndex: 3 }
        ]
      },
      {
        id: 'set-2', courseId: this.courseId, title: 'Day 2: Bubba\'s Food', description: 'Mèo Bubba.', orderIndex: 2, requiredDays: 7,
        lessons: [
          { id: 'l-2-main', lessonSetId: 'set-2', title: 'Bubba - Main Audio', type: 'MAIN', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', orderIndex: 1 },
          { id: 'l-2-pov', lessonSetId: 'set-2', title: 'Bubba - POV', type: 'POV', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', orderIndex: 2 }
        ]
      }
    ];

    // TODO: Uncomment when API is ready
    /*
    this.courseService.courses$.subscribe((courses: any[]) => {
      this.course = courses.find((c: any) => c.id === this.courseId);
    });
    
    this.lessonSetService.getLessonSetsByCourse(this.courseId).subscribe(sets => {
      this.lessonSets = sets;
      if (sets.length > 0) {
        this.expandedSetId = sets[0].id;
      }
    });
    */
  }

  goToSet(setId: string) {
    this.router.navigate(['/dashboard/sets', setId]);
  }
}
