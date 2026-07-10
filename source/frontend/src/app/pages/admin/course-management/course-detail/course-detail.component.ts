import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

import { CourseService } from '../../../../services/course.service';
import { LessonSetService, LessonSet } from '../../../../services/lesson-set.service';
import { LessonService, Lesson } from '../../../../services/lesson.service';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DragDropModule, QuillModule],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {
  courseId: string = '';
  course: any = null;
  lessonSets: LessonSet[] = [];
  
  // Modal states
  showSetModal = false;
  
  // Form data
  currentSet: any = { title: '', description: '', requiredDays: 7, orderIndex: 0 };
  
  isEditingSet = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private lessonSetService: LessonSetService,
    private lessonService: LessonService
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
    // Load Course info
    this.courseService.courses$.subscribe((courses: any[]) => {
      this.course = courses.find((c: any) => c.id === this.courseId);
    });
    
    // Load Lesson Sets
    this.lessonSetService.getLessonSetsByCourse(this.courseId).subscribe(sets => {
      this.lessonSets = sets;
    });
  }

  dropSet(event: CdkDragDrop<LessonSet[]>) {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.lessonSets, event.previousIndex, event.currentIndex);
      const orderedIds = this.lessonSets.map(s => s.id);
      this.lessonSetService.reorderLessonSets(orderedIds).subscribe({
        next: () => console.log('Đã cập nhật thứ tự Bộ bài học'),
        error: (err) => console.error('Lỗi khi cập nhật thứ tự', err)
      });
    }
  }

  // --- Lesson Set ---
  openSetModal(set?: LessonSet) {
    if (set) {
      this.isEditingSet = true;
      this.currentSet = { ...set };
    } else {
      this.isEditingSet = false;
      this.currentSet = { title: '', description: '', requiredDays: 7, orderIndex: this.lessonSets.length + 1, courseId: this.courseId };
    }
    this.showSetModal = true;
  }

  closeSetModal() {
    this.showSetModal = false;
  }

  saveSet() {
    const payload = {
      title: this.currentSet.title,
      description: this.currentSet.description,
      requiredDays: this.currentSet.requiredDays,
      orderIndex: this.currentSet.orderIndex,
      courseId: this.currentSet.courseId
    };

    if (this.isEditingSet) {
      this.lessonSetService.updateLessonSet(this.currentSet.id, payload).subscribe(() => {
        this.loadData();
        this.closeSetModal();
      });
    } else {
      this.lessonSetService.createLessonSet(payload).subscribe(() => {
        this.loadData();
        this.closeSetModal();
      });
    }
  }

  deleteSet(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa Bộ bài học này không? Tất cả bài học bên trong sẽ bị xóa theo.')) {
      this.lessonSetService.deleteLessonSet(id).subscribe(() => {
        this.loadData();
      });
    }
  }

  // --- Lesson ---
  deleteLesson(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa Bài học này không?')) {
      this.lessonService.deleteLesson(id).subscribe(() => {
        this.loadData();
      });
    }
  }

  getRouteForType(type: string): string {
    switch (type) {
      case 'MAIN': return 'main';
      case 'VOCAB': return 'vocab';
      case 'MINI_STORY': return 'mini-stories';
      case 'POV': return 'pov';
      default: return 'main';
    }
  }
}
