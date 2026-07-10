import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../../../../services/audio.service';

@Component({
  selector: 'app-vocab-lesson-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="vocab-container">
      <div class="vocab-card animate-fade" *ngFor="let vocab of transcripts">
        <div class="card-header">
          <div class="vocab-word">{{ getWord(vocab) }}</div>
          
          <div class="card-actions" *ngIf="hasAudio && vocab.startTime">
            <span class="time-badge">{{ formatTime(vocab.startTime) }}</span>
            <button class="btn-play-audio" (click)="playFrom(vocab.startTime)" title="Nghe giải thích từ này">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
            </button>
          </div>
        </div>
        
        <div class="vocab-meaning">{{ getMeaning(vocab) }}</div>
      </div>

      <div class="empty-state" *ngIf="transcripts.length === 0">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
        <p>Bài học này chưa có danh sách từ vựng.</p>
      </div>
    </div>
  `,
  styles: [`
    .vocab-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 32px 24px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
      animation: fadeIn 0.4s ease-out;
    }

    .vocab-card {
      background: var(--glass-bg);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: var(--shadow-sm);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
        border-color: rgba(59, 130, 246, 0.3);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
      }

      .vocab-word {
        font-size: 20px;
        font-weight: 800;
        letter-spacing: -0.5px;
        color: var(--course-blue);
        line-height: 1.2;
      }

      .card-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
      }

      .time-badge {
        font-family: monospace;
        font-size: 11px;
        font-weight: 700;
        padding: 4px 8px;
        background: rgba(59, 130, 246, 0.08);
        color: var(--course-blue);
        border-radius: 6px;
        border: 1px solid rgba(59, 130, 246, 0.15);
      }

      .btn-play-audio {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--course-blue) 0%, #2563eb 100%);
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
        transition: all 0.3s;

        &:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 14px rgba(59, 130, 246, 0.5);
        }
      }

      .vocab-meaning {
        font-size: 14.5px;
        line-height: 1.6;
        color: var(--text-secondary);
        font-weight: 500;
      }
    }

    .empty-state {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      color: var(--text-muted);
      text-align: center;
      gap: 16px;
      background: var(--glass-bg);
      border: 1px dashed var(--border-color);
      border-radius: 16px;

      p {
        margin: 0;
        font-size: 15px;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .vocab-container {
        grid-template-columns: 1fr;
        padding: 16px;
      }
    }
  `]
})
export class VocabLessonViewComponent {
  @Input() transcripts: any[] = [];
  @Input() hasAudio: boolean = true;

  constructor(private audioService: AudioService) {}

  // Lấy từ vựng (hỗ trợ dữ liệu mới lưu trong DB và dữ liệu cũ phân tách qua ký tự " - ")
  getWord(vocab: any): string {
    if (vocab.vocabularyWord) {
      return vocab.vocabularyWord;
    }
    return vocab.textContent.split(' - ')[0] || vocab.textContent;
  }
  
  // Lấy giải nghĩa
  getMeaning(vocab: any): string {
    if (vocab.vocabularyWord) {
      return vocab.textContent;
    }
    return vocab.textContent.split(' - ')[1] || '';
  }

  // Nhảy nhanh Audio tới mốc thời gian giải thích
  playFrom(time: number) {
    this.audioService.seek(time);
    
    // Nếu audio đang dừng, kích hoạt chạy tiếp
    const sub = this.audioService.state$.subscribe((state: any) => {
      if (!state.isPlaying) {
        this.audioService.togglePlay();
      }
    });
    sub.unsubscribe();
  }

  // Format giây thành dạng mm:ss
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
