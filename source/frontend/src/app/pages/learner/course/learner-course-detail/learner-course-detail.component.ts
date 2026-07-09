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
    // Tải thông tin khóa học
    this.courseService.getCourseById(this.courseId).subscribe(course => {
      this.course = course;
    });
    
    // Tải danh sách bộ bài học
    this.lessonSetService.getLessonSetsByCourse(this.courseId).subscribe(sets => {
      this.lessonSets = sets;
    });
  }

  goToSet(setId: string) {
    this.router.navigate(['/dashboard/sets', setId]);
  }
}
