import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LessonSetService, LessonSet } from '../../../../services/lesson-set.service';

@Component({
  selector: 'app-lesson-set-manager',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lesson-set-manager.component.html',
  styleUrls: ['./lesson-set-manager.component.scss']
})
export class LessonSetManagerComponent implements OnInit {
  courseId: string = '';
  setId: string = '';
  lessonSet: LessonSet | null = null;

  constructor(
    private route: ActivatedRoute,
    private lessonSetService: LessonSetService
  ) {}

  ngOnInit() {
    // Get parameters from parent route
    this.route.params.subscribe(params => {
      this.courseId = params['courseId'];
      this.setId = params['setId'];
      if (this.setId) {
        this.loadLessonSet();
      }
    });
  }

  loadLessonSet() {
    this.lessonSetService.getLessonSetById(this.setId).subscribe({
      next: (set) => {
        this.lessonSet = set;
      },
      error: (err) => {
        console.error('Lỗi khi tải bộ bài học:', err);
      }
    });
  }
}
