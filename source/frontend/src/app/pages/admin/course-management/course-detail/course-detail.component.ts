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
  showLessonModal = false;
  
  // Form data
  currentSet: any = { title: '', description: '', requiredDays: 7, orderIndex: 0 };
  currentLesson: any = { title: '', type: 'MAIN', audioUrl: '', orderIndex: 0, lessonSetId: '' };
  
  isEditingSet = false;
  isEditingLesson = false;

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
  openLessonModal(setId: string, lesson?: Lesson) {
    if (lesson) {
      this.isEditingLesson = true;
      // Copy lesson object to avoid two-way binding mutation before save
      // Ensure transcripts is cloned
      this.currentLesson = { ...lesson, transcripts: lesson.transcripts ? [...lesson.transcripts] : [] };
    } else {
      this.isEditingLesson = false;
      const set = this.lessonSets.find(s => s.id === setId);
      const nextOrder = set && set.lessons ? set.lessons.length + 1 : 1;
      this.currentLesson = { title: '', type: 'MAIN', audioUrl: '', orderIndex: nextOrder, lessonSetId: setId, transcripts: [] };
    }
    this.showLessonModal = true;
  }

  closeLessonModal() {
    this.showLessonModal = false;
  }

  addVocab() {
    if (!this.currentLesson.transcripts) {
      this.currentLesson.transcripts = [];
    }
    this.currentLesson.transcripts.push({ vocabularyWord: '', textContent: '', startTime: 0, endTime: 0 });
  }

  removeVocab(index: number) {
    this.currentLesson.transcripts.splice(index, 1);
  }

  parseVTT() {
    if (!this.currentLesson.vttContent) return;
    const lines = this.currentLesson.vttContent.split('\n');
    const transcripts = [];
    let currentTranscript: any = null;

    const timeRegex = /(\d{2}:)?(\d{2}):(\d{2})\.(\d{3})\s+-->\s+(\d{2}:)?(\d{2}):(\d{2})\.(\d{3})/;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line === 'WEBVTT') continue;

      const match = line.match(timeRegex);
      if (match) {
        const startHours = match[1] ? parseInt(match[1].replace(':', '')) : 0;
        const startMins = parseInt(match[2]);
        const startSecs = parseInt(match[3]);
        const startMs = parseInt(match[4]);
        const startTime = startHours * 3600 + startMins * 60 + startSecs + startMs / 1000;

        const endHours = match[5] ? parseInt(match[5].replace(':', '')) : 0;
        const endMins = parseInt(match[6]);
        const endSecs = parseInt(match[7]);
        const endMs = parseInt(match[8]);
        const endTime = endHours * 3600 + endMins * 60 + endSecs + endMs / 1000;

        currentTranscript = { startTime, endTime, textContent: '' };
      } else if (currentTranscript && !line.includes('-->') && !/^\d+$/.test(line)) {
         currentTranscript.textContent += (currentTranscript.textContent ? ' ' : '') + line;
      } else if (currentTranscript && line === '') {
         transcripts.push(currentTranscript);
         currentTranscript = null;
      }
    }
    if (currentTranscript && currentTranscript.textContent) {
      transcripts.push(currentTranscript);
    }
    this.currentLesson.transcripts = transcripts;
  }

  saveLesson() {
    const payload = {
      title: this.currentLesson.title,
      type: this.currentLesson.type,
      audioUrl: this.currentLesson.audioUrl,
      durationSeconds: this.currentLesson.durationSeconds,
      orderIndex: this.currentLesson.orderIndex,
      lessonSetId: this.currentLesson.lessonSetId,
      htmlContent: this.currentLesson.type === 'MAIN' ? this.currentLesson.htmlContent : null,
      transcripts: this.currentLesson.type !== 'MAIN' ? this.currentLesson.transcripts : []
    };

    if (this.isEditingLesson) {
      this.lessonService.updateLesson(this.currentLesson.id, payload).subscribe(() => {
        this.loadData();
        this.closeLessonModal();
      });
    } else {
      this.lessonService.createLesson(payload).subscribe(() => {
        this.loadData();
        this.closeLessonModal();
      });
    }
  }

  deleteLesson(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa Bài học này không?')) {
      this.lessonService.deleteLesson(id).subscribe(() => {
        this.loadData();
      });
    }
  }
}
