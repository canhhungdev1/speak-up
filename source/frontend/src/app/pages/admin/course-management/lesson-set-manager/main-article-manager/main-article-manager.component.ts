import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { LessonService, Lesson } from '../../../../../services/lesson.service';

@Component({
  selector: 'app-main-article-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './main-article-manager.component.html',
  styleUrls: ['./main-article-manager.component.scss']
})
export class MainArticleManagerComponent implements OnInit {
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
    // Parent route contains the parameters courseId and setId
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
        const mainLesson = lessons.find(l => l.type === 'MAIN');
        if (mainLesson) {
          this.lesson = { ...mainLesson };
        } else {
          // Initialize empty MAIN lesson if it doesn't exist
          this.lesson = {
            id: '',
            lessonSetId: this.setId,
            title: 'Main Article',
            type: 'MAIN',
            audioUrl: '',
            htmlContent: '',
            transcripts: []
          };
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải bài học:', err);
        this.isLoading = false;
      }
    });
  }

  save() {
    if (!this.lesson || !this.lesson.title || !this.lesson.audioUrl) {
      alert('Vui lòng điền đầy đủ Tên bài và Đường dẫn File MP3.');
      return;
    }

    this.isSaving = true;
    this.saveSuccess = false;

    const payload = {
      title: this.lesson.title,
      type: 'MAIN',
      audioUrl: this.lesson.audioUrl,
      lessonSetId: this.setId,
      htmlContent: this.lesson.htmlContent || '',
      transcripts: []
    };

    if (this.lesson.id) {
      // Update
      this.lessonService.updateLesson(this.lesson.id, payload).subscribe({
        next: (updated) => {
          this.lesson = { ...updated };
          this.isSaving = false;
          this.showSuccessMessage();
        },
        error: (err) => {
          console.error('Lỗi khi cập nhật bài học:', err);
          this.isSaving = false;
        }
      });
    } else {
      // Create
      this.lessonService.createLesson(payload).subscribe({
        next: (created) => {
          this.lesson = { ...created };
          this.isSaving = false;
          this.showSuccessMessage();
        },
        error: (err) => {
          console.error('Lỗi khi tạo bài học:', err);
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
