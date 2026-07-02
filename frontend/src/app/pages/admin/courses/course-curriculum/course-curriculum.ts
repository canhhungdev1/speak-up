import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-course-curriculum',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DragDropModule],
  templateUrl: './course-curriculum.html',
  styleUrl: './course-curriculum.scss'
})
export class CourseCurriculum implements OnInit {
  courseId: string | null = null;

  // Mock data for UI development
  lessonSets = [
    {
      id: 'set-1',
      title: 'Day 1: A Kiss',
      orderIndex: 1,
      isExpanded: true,
      lessons: [
        { id: 'l1', title: 'A Kiss - Audio Article', type: 'MAIN_AUDIO', orderIndex: 1 },
        { id: 'l2', title: 'A Kiss - Vocabulary', type: 'VOCABULARY', orderIndex: 2 },
        { id: 'l3', title: 'A Kiss - Mini Story', type: 'MINI_STORY', orderIndex: 3 },
        { id: 'l4', title: 'A Kiss - POV', type: 'POV', orderIndex: 4 }
      ]
    },
    {
      id: 'set-2',
      title: 'Day 2: Bubba\'s Food',
      orderIndex: 2,
      isExpanded: false,
      lessons: [
        { id: 'l5', title: 'Bubba\'s Food - Audio Article', type: 'MAIN_AUDIO', orderIndex: 1 },
        { id: 'l6', title: 'Bubba\'s Food - Mini Story', type: 'MINI_STORY', orderIndex: 2 }
      ]
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');
  }

  // Modal States
  isSetModalOpen = false;
  currentSet: any = { title: '', orderIndex: 1 };
  isEditSet = false;

  isLessonModalOpen = false;
  currentLesson: any = { title: '', type: 'MAIN_AUDIO', orderIndex: 1, content: {} };
  currentLessonSetId: string | null = null;
  isEditLesson = false;

  dropLessonSet(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.lessonSets, event.previousIndex, event.currentIndex);
  }

  dropLesson(event: CdkDragDrop<any[]>, set: any) {
    moveItemInArray(set.lessons, event.previousIndex, event.currentIndex);
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
    if (!this.currentSet.title) {
      alert('Please enter set title');
      return;
    }
    
    if (this.isEditSet) {
      // Logic for editing
      const index = this.lessonSets.findIndex(s => s.id === this.currentSet.id);
      if (index > -1) {
        this.lessonSets[index].title = this.currentSet.title;
      }
    } else {
      this.lessonSets.push({
        id: 'set-' + Date.now(),
        title: this.currentSet.title,
        orderIndex: this.currentSet.orderIndex,
        isExpanded: true,
        lessons: []
      });
    }
    this.closeSetModal();
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
      orderIndex: (set?.lessons.length || 0) + 1,
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
    if (!set) return;

    if (this.isEditLesson) {
      const index = set.lessons.findIndex(l => l.id === this.currentLesson.id);
      if (index > -1) {
        set.lessons[index] = { ...this.currentLesson };
      }
    } else {
      set.lessons.push({
        id: 'lesson-' + Date.now(),
        ...this.currentLesson
      });
    }
    this.closeLessonModal();
  }

  deleteLesson(lesson: any, setId: string) {
    if(confirm('Are you sure you want to delete this lesson?')) {
      const set = this.lessonSets.find(s => s.id === setId);
      if (set) {
        set.lessons = set.lessons.filter(l => l.id !== lesson.id);
      }
    }
  }
}
