import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CourseService, Course, LessonSet, Lesson } from '../../../../core/services/course.service';

@Component({
  selector: 'app-course-curriculum',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DragDropModule],
  templateUrl: './course-curriculum.html',
  styleUrl: './course-curriculum.scss'
})
export class CourseCurriculum implements OnInit {
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private cdr = inject(ChangeDetectorRef);

  courseId: string | null = null;
  course: Course | null = null;
  lessonSets: LessonSet[] = [];

  // Modal States
  isSetModalOpen = false;
  currentSet: any = { title: '', orderIndex: 1 };
  isEditSet = false;

  isLessonModalOpen = false;
  currentLesson: any = { title: '', type: 'MAIN_AUDIO', orderIndex: 1, content: {} };
  currentLessonSetId: string | null = null;
  isEditLesson = false;

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId) {
      this.loadCurriculum();
    }
  }

  loadCurriculum() {
    if (!this.courseId) return;
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.course = course;
        this.lessonSets = (course.lessonSets || []).map(set => ({
          ...set,
          isExpanded: true
        }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load curriculum', err)
    });
  }

  dropLessonSet(event: CdkDragDrop<any[]>) {
    if (event.previousIndex === event.currentIndex) return;
    
    moveItemInArray(this.lessonSets, event.previousIndex, event.currentIndex);
    
    // Update orderIndex in UI
    const updates = this.lessonSets.map((set, index) => {
      set.orderIndex = index + 1;
      return { id: set.id!, orderIndex: set.orderIndex };
    });

    // Save to backend
    if (this.courseId) {
      this.courseService.reorderLessonSets(this.courseId, updates).subscribe({
        next: () => console.log('Reordered sets successfully'),
        error: (err) => {
          console.error('Failed to reorder sets', err);
          alert('Failed to save new order');
        }
      });
    }
  }

  dropLesson(event: CdkDragDrop<any[]>, set: any) {
    if (event.previousIndex === event.currentIndex) return;

    moveItemInArray(set.lessons, event.previousIndex, event.currentIndex);

    // Update orderIndex in UI
    const updates = set.lessons.map((lesson: any, index: number) => {
      lesson.orderIndex = index + 1;
      return { id: lesson.id, orderIndex: lesson.orderIndex };
    });

    // Save to backend
    this.courseService.reorderLessons(set.id, updates).subscribe({
      next: () => console.log('Reordered lessons successfully'),
      error: (err) => {
        console.error('Failed to reorder lessons', err);
        alert('Failed to save new order');
      }
    });
  }

  toggleSet(set: any) {
    set.isExpanded = !set.isExpanded;
  }

  // --- Lesson Set Modal ---
  openAddLessonSet() {
    this.isEditSet = false;
    this.currentSet = { title: '', orderIndex: this.lessonSets.length + 1 };
    this.isSetModalOpen = true;
  }

  closeSetModal() {
    this.isSetModalOpen = false;
  }

  saveLessonSet() {
    if (!this.currentSet.title || !this.courseId) {
      alert('Please enter set title');
      return;
    }
    
    if (this.isEditSet) {
      // Logic for editing
      const index = this.lessonSets.findIndex(s => s.id === this.currentSet.id);
      if (index > -1) {
        this.lessonSets[index].title = this.currentSet.title;
      }
      this.closeSetModal();
    } else {
      this.courseService.createLessonSet(this.courseId, {
        title: this.currentSet.title,
        orderIndex: this.currentSet.orderIndex
      }).subscribe({
        next: (createdSet) => {
          this.lessonSets.push({ ...createdSet, isExpanded: true, lessons: [] });
          this.closeSetModal();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to create lesson set', err);
          alert('Failed to create lesson set');
        }
      });
    }
  }

  editLessonSet(set: any, event: Event) {
    event.stopPropagation();
    this.isEditSet = true;
    this.currentSet = { ...set };
    this.isSetModalOpen = true;
  }

  deleteLessonSet(set: any, event: Event) {
    event.stopPropagation();
    if(confirm('Are you sure you want to delete this Lesson Set?')) {
      this.lessonSets = this.lessonSets.filter(s => s.id !== set.id);
    }
  }

  // --- Lesson Modal ---
  openAddLesson(setId: string) {
    this.isEditLesson = false;
    this.currentLessonSetId = setId;
    const set = this.lessonSets.find(s => s.id === setId);
    this.currentLesson = { 
      title: '', 
      type: 'MAIN_AUDIO', 
      orderIndex: (set?.lessons?.length || 0) + 1,
      content: { textHtml: '' }
    };
    this.isLessonModalOpen = true;
  }

  editLesson(lesson: any, setId: string) {
    this.isEditLesson = true;
    this.currentLessonSetId = setId;
    this.currentLesson = { ...lesson };
    // Initialize content structure if missing
    if (!this.currentLesson.content) {
      this.currentLesson.content = {};
      if (this.currentLesson.type === 'VOCABULARY') this.currentLesson.content.words = [];
    }
    this.isLessonModalOpen = true;
  }

  closeLessonModal() {
    this.isLessonModalOpen = false;
  }

  onLessonTypeChange() {
    // Reset content based on type
    const type = this.currentLesson.type;
    if (type === 'MAIN_AUDIO' || type === 'POV') {
      this.currentLesson.content = { textHtml: '' };
    } else if (type === 'VOCABULARY') {
      this.currentLesson.content = { words: [] };
    } else if (type === 'MINI_STORY') {
      this.currentLesson.content = { transcript: [] };
    }
  }

  addWordToVocab() {
    if (!this.currentLesson.content.words) {
      this.currentLesson.content.words = [];
    }
    this.currentLesson.content.words.push({ word: '', type: 'n', meaning: '' });
  }

  removeWord(index: number) {
    this.currentLesson.content.words.splice(index, 1);
  }

  saveLesson() {
    if (!this.currentLesson.title) {
      alert('Please enter lesson title');
      return;
    }

    const set = this.lessonSets.find(s => s.id === this.currentLessonSetId);
    if (!set || !set.id) return;

    if (this.isEditLesson) {
      const index = set.lessons!.findIndex(l => l.id === this.currentLesson.id);
      if (index > -1) {
        set.lessons![index] = { ...this.currentLesson };
      }
      this.closeLessonModal();
    } else {
      this.courseService.createLesson(set.id, {
        title: this.currentLesson.title,
        type: this.currentLesson.type,
        orderIndex: this.currentLesson.orderIndex
      }).subscribe({
        next: (createdLesson) => {
          if (!set.lessons) set.lessons = [];
          set.lessons.push(createdLesson);
          this.closeLessonModal();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to create lesson', err);
          alert('Failed to create lesson');
        }
      });
    }
  }

  deleteLesson(lesson: any, setId: string) {
    if(confirm('Are you sure you want to delete this lesson?')) {
      const set = this.lessonSets.find(s => s.id === setId);
      if (set) {
        set.lessons = (set.lessons || []).filter(l => l.id !== lesson.id);
      }
    }
  }
}
