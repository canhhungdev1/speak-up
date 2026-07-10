import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LessonService, Lesson } from '../../../../../services/lesson.service';

@Component({
  selector: 'app-vocab-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vocab-manager.component.html',
  styleUrls: ['./vocab-manager.component.scss']
})
export class VocabManagerComponent implements OnInit {
  courseId: string = '';
  setId: string = '';
  lesson: Lesson | null = null;
  isLoading = true;
  isSaving = false;
  saveSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private lessonService: LessonService
  ) {}

  ngOnInit() {
    if (this.route.parent) {
      this.route.parent.params.subscribe(params => {
        this.courseId = params['courseId'];
        this.setId = params['setId'];
        if (this.setId) {
          this.loadLesson();
        }
      });
    }
  }

  loadLesson() {
    this.isLoading = true;
    this.lessonService.getLessonsBySet(this.setId).subscribe({
      next: (lessons) => {
        const vocabLesson = lessons.find(l => l.type === 'VOCAB');
        if (vocabLesson) {
          // Clone to prevent mutating reference before save
          this.lesson = {
            ...vocabLesson,
            transcripts: vocabLesson.transcripts ? [...vocabLesson.transcripts] : []
          };
        } else {
          this.lesson = {
            id: '',
            lessonSetId: this.setId,
            title: 'Vocabulary',
            type: 'VOCAB',
            audioUrl: '',
            transcripts: []
          };
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải bài từ vựng:', err);
        this.isLoading = false;
      }
    });
  }

  addVocab() {
    if (!this.lesson) return;
    if (!this.lesson.transcripts) {
      this.lesson.transcripts = [];
    }
    this.lesson.transcripts.push({
      vocabularyWord: '',
      textContent: '',
      startTime: 0,
      endTime: 0
    });
  }

  removeVocab(index: number) {
    if (!this.lesson || !this.lesson.transcripts) return;
    this.lesson.transcripts.splice(index, 1);
  }

  save() {
    if (!this.lesson || !this.lesson.title || !this.lesson.audioUrl) {
      alert('Vui lòng điền đầy đủ Tên bài và Đường dẫn File MP3.');
      return;
    }

    this.isSaving = true;
    this.saveSuccess = false;

    // Standardize transcripts to avoid null/undefined
    const cleanTranscripts = (this.lesson.transcripts || []).map(t => ({
      vocabularyWord: t.vocabularyWord || '',
      textContent: t.textContent || '',
      startTime: Number(t.startTime) || 0,
      endTime: Number(t.endTime) || 0
    }));

    const payload = {
      title: this.lesson.title,
      type: 'VOCAB',
      audioUrl: this.lesson.audioUrl,
      lessonSetId: this.setId,
      htmlContent: null,
      transcripts: cleanTranscripts
    };

    if (this.lesson.id) {
      this.lessonService.updateLesson(this.lesson.id, payload).subscribe({
        next: (updated) => {
          this.lesson = {
            ...updated,
            transcripts: updated.transcripts ? [...updated.transcripts] : []
          };
          this.isSaving = false;
          this.showSuccessMessage();
        },
        error: (err) => {
          console.error('Lỗi khi lưu bài từ vựng:', err);
          this.isSaving = false;
        }
      });
    } else {
      this.lessonService.createLesson(payload).subscribe({
        next: (created) => {
          this.lesson = {
            ...created,
            transcripts: created.transcripts ? [...created.transcripts] : []
          };
          this.isSaving = false;
          this.showSuccessMessage();
        },
        error: (err) => {
          console.error('Lỗi khi tạo bài từ vựng:', err);
          this.isSaving = false;
        }
      });
    }
  }

  showSuccessMessage() {
    this.saveSuccess = true;
    setTimeout(() => {
      this.saveSuccess = false;
    }, 3000);
  }
}
