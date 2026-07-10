import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LessonService, Lesson } from '../../../../../services/lesson.service';

@Component({
  selector: 'app-pov-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pov-manager.component.html',
  styleUrls: ['./pov-manager.component.scss']
})
export class PovManagerComponent implements OnInit {
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
        const povLesson = lessons.find(l => l.type === 'POV');
        if (povLesson) {
          this.lesson = {
            ...povLesson,
            transcripts: povLesson.transcripts ? [...povLesson.transcripts] : []
          };
        } else {
          this.lesson = {
            id: '',
            lessonSetId: this.setId,
            title: 'Point of View',
            type: 'POV',
            audioUrl: '',
            transcripts: [],
            vttContent: ''
          };
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải POV:', err);
        this.isLoading = false;
      }
    });
  }

  parseVTT() {
    if (!this.lesson || !this.lesson.vttContent) return;
    const lines = this.lesson.vttContent.split('\n');
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
    this.lesson.transcripts = transcripts;
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
      type: 'POV',
      audioUrl: this.lesson.audioUrl,
      lessonSetId: this.setId,
      htmlContent: null,
      transcripts: this.lesson.transcripts || [],
      vttContent: this.lesson.vttContent || ''
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
          console.error('Lỗi khi cập nhật POV:', err);
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
          console.error('Lỗi khi tạo POV:', err);
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
