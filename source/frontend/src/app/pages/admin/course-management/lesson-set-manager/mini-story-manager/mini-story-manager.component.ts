import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LessonService, Lesson } from '../../../../../services/lesson.service';

@Component({
  selector: 'app-mini-story-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mini-story-manager.component.html',
  styleUrls: ['./mini-story-manager.component.scss']
})
export class MiniStoryManagerComponent implements OnInit {
  courseId: string = '';
  setId: string = '';
  miniStories: Lesson[] = [];
  selectedStory: Lesson | null = null;
  
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
          this.loadMiniStories();
        }
      });
    }
  }

  loadMiniStories() {
    this.isLoading = true;
    this.lessonService.getLessonsBySet(this.setId).subscribe({
      next: (lessons) => {
        this.miniStories = lessons.filter(l => l.type === 'MINI_STORY');
        if (this.miniStories.length > 0) {
          // Select the first one by default
          this.selectStory(this.miniStories[0]);
        } else {
          this.selectedStory = null;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải Mini Stories:', err);
        this.isLoading = false;
      }
    });
  }

  selectStory(story: Lesson) {
    // Clone to prevent mutating array before save
    this.selectedStory = {
      ...story,
      transcripts: story.transcripts ? [...story.transcripts] : []
    };
  }

  createNewStory() {
    this.selectedStory = {
      id: '',
      lessonSetId: this.setId,
      title: 'Mini Story ' + (this.miniStories.length + 1),
      type: 'MINI_STORY',
      audioUrl: '',
      transcripts: [],
      vttContent: ''
    };
  }

  parseVTT() {
    if (!this.selectedStory || !this.selectedStory.vttContent) return;
    const lines = this.selectedStory.vttContent.split('\n');
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
    this.selectedStory.transcripts = transcripts;
  }

  save() {
    if (!this.selectedStory || !this.selectedStory.title || !this.selectedStory.audioUrl) {
      alert('Vui lòng điền đầy đủ Tên bài và Đường dẫn File MP3.');
      return;
    }

    this.isSaving = true;
    this.saveSuccess = false;

    const payload = {
      title: this.selectedStory.title,
      type: 'MINI_STORY',
      audioUrl: this.selectedStory.audioUrl,
      lessonSetId: this.setId,
      htmlContent: null,
      transcripts: this.selectedStory.transcripts || [],
      vttContent: this.selectedStory.vttContent || ''
    };

    if (this.selectedStory.id) {
      this.lessonService.updateLesson(this.selectedStory.id, payload).subscribe({
        next: (updated) => {
          this.isSaving = false;
          this.showSuccessMessage();
          this.refreshList(updated);
        },
        error: (err) => {
          console.error('Lỗi khi cập nhật Mini Story:', err);
          this.isSaving = false;
        }
      });
    } else {
      this.lessonService.createLesson(payload).subscribe({
        next: (created) => {
          this.isSaving = false;
          this.showSuccessMessage();
          this.refreshList(created);
        },
        error: (err) => {
          console.error('Lỗi khi tạo Mini Story:', err);
          this.isSaving = false;
        }
      });
    }
  }

  deleteStory(id: string) {
    if (!id) {
      // Canceling new story
      this.loadMiniStories();
      return;
    }

    if (confirm('Bạn có chắc chắn muốn xóa Mini Story này không?')) {
      this.lessonService.deleteLesson(id).subscribe({
        next: () => {
          this.loadMiniStories();
        },
        error: (err) => {
          console.error('Lỗi khi xóa Mini Story:', err);
        }
      });
    }
  }

  refreshList(activeStory: Lesson) {
    this.lessonService.getLessonsBySet(this.setId).subscribe(lessons => {
      this.miniStories = lessons.filter(l => l.type === 'MINI_STORY');
      const found = this.miniStories.find(m => m.id === activeStory.id);
      if (found) {
        this.selectStory(found);
      }
    });
  }

  showSuccessMessage() {
    this.saveSuccess = true;
    setTimeout(() => {
      this.saveSuccess = false;
    }, 3000);
  }
}
