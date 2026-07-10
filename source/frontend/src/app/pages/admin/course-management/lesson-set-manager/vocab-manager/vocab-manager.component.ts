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

  showModal = false;
  modalTitle = 'Thêm từ vựng mới';
  modalVocab = {
    index: -1,
    vocabularyWord: '',
    textContent: '',
    startTime: 0
  };

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

  openAddModal() {
    this.modalTitle = 'Thêm từ vựng mới';
    this.modalVocab = {
      index: -1,
      vocabularyWord: '',
      textContent: '',
      startTime: 0
    };
    this.showModal = true;
  }

  openEditModal(index: number, vocab: any) {
    this.modalTitle = 'Sửa từ vựng';
    this.modalVocab = {
      index: index,
      vocabularyWord: vocab.vocabularyWord || '',
      textContent: vocab.textContent || '',
      startTime: vocab.startTime || 0
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveModalVocab() {
    if (!this.lesson) return;
    if (!this.lesson.transcripts) {
      this.lesson.transcripts = [];
    }

    if (!this.modalVocab.vocabularyWord || !this.modalVocab.textContent) {
      alert('Vui lòng nhập Từ gốc và Ý nghĩa.');
      return;
    }

    const vocabData = {
      vocabularyWord: this.modalVocab.vocabularyWord,
      textContent: this.modalVocab.textContent,
      startTime: Number(this.modalVocab.startTime) || 0,
      endTime: 0
    };

    if (this.modalVocab.index === -1) {
      this.lesson.transcripts.push(vocabData);
    } else {
      this.lesson.transcripts[this.modalVocab.index] = vocabData;
    }

    this.closeModal();
    this.save(); // Tự động lưu
  }

  removeVocab(index: number) {
    if (!this.lesson || !this.lesson.transcripts) return;
    if (confirm('Bạn có chắc chắn muốn xóa từ vựng này?')) {
      this.lesson.transcripts.splice(index, 1);
      this.save(); // Tự động lưu
    }
  }

  formatTime(seconds: number): string {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  save() {
    if (!this.lesson || !this.lesson.title) {
      alert('Vui lòng điền đầy đủ Tên bài.');
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
      audioUrl: this.lesson.audioUrl || null,
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
