import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TranscriptLine {
  id: number;
  text: string;
  timestamp: number; // in seconds
}

@Component({
  selector: 'app-audio-player-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="audio-card">
      <!-- Audio Meta Header -->
      <div class="audio-meta">
        <div class="album-art">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
        </div>
        <div class="meta-text">
          <h4 class="title">Dragons (Mini-Story)</h4>
          <p class="author">A.J. Hoge</p>
        </div>
      </div>

      <!-- Transcript Sync Display -->
      <div class="transcript-container">
        @for (line of transcriptLines; track line.id) {
          <p 
            class="transcript-line"
            [class.active]="activeLineId() === line.id"
            (click)="selectLine(line)"
          >
            {{ line.text }}
          </p>
        }
      </div>

      <!-- Progress Bar -->
      <div class="progress-section">
        <div class="progress-bar-container" (click)="onProgressClick($event)">
          <div class="progress-bar-fill" [style.width.%]="progressPercent()"></div>
        </div>
        <div class="time-display">
          <span>{{ formatTime(currentTime()) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- Player Controls -->
      <div class="controls">
        <button class="control-btn" (click)="skip(-5)" title="Rewind 5s">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 19 2 12 11 5 11 19"></polygon>
            <polygon points="22 19 13 12 22 5 22 19"></polygon>
          </svg>
        </button>

        <button class="play-btn" (click)="togglePlay()" [title]="isPlaying() ? 'Pause' : 'Play Audio Preview'">
          @if (isPlaying()) {
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"></rect>
              <rect x="14" y="4" width="4" height="16" rx="1"></rect>
            </svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 2px;">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          }
        </button>

        <button class="control-btn" (click)="skip(5)" title="Forward 5s">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="13 19 22 12 13 5 13 19"></polygon>
            <polygon points="2 19 11 12 2 5 2 19"></polygon>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .audio-card {
      background-color: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 24px;
      padding: 28px;
      box-shadow: var(--shadow-lg);
      width: 100%;
      max-width: 440px;
      transition: all 0.3s ease;
      position: relative;
    }

    .audio-meta {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .album-art {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: linear-gradient(135deg, #FF6B00 0%, #FFA800 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);
    }

    .meta-text {
      .title {
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--text-main);
      }
      .author {
        font-size: 0.85rem;
        color: var(--text-muted);
        font-weight: 500;
      }
    }

    .transcript-container {
      background-color: var(--bg-main);
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-height: 120px;
      justify-content: center;
    }

    .transcript-line {
      font-size: 0.95rem;
      color: var(--text-muted);
      transition: all 0.3s ease;
      cursor: pointer;
      line-height: 1.5;

      &:hover {
        color: var(--text-secondary);
      }

      &.active {
        font-weight: 800;
        color: var(--text-main);
        transform: scale(1.02);
        transform-origin: left center;
      }
    }

    .progress-section {
      margin-bottom: 20px;
    }

    .progress-bar-container {
      height: 6px;
      background-color: var(--border-color);
      border-radius: 9999px;
      overflow: hidden;
      cursor: pointer;
      position: relative;
    }

    .progress-bar-fill {
      height: 100%;
      background: var(--gradient-primary);
      border-radius: 9999px;
      transition: width 0.1s linear;
    }

    .time-display {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    .controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
    }

    .control-btn {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      transition: color 0.2s ease, transform 0.2s ease;

      &:hover {
        color: var(--primary);
        transform: scale(1.1);
      }
    }

    .play-btn {
      width: 52px;
      height: 52px;
      border-radius: 9999px;
      background: var(--gradient-primary);
      color: #FFFFFF;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
      transition: transform 0.25s ease, box-shadow 0.25s ease;

      &:hover {
        transform: scale(1.08);
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.55);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  `]
})
export class AudioPlayerWidgetComponent implements OnDestroy {
  transcriptLines: TranscriptLine[] = [
    { id: 1, text: 'There was a beautiful princess.', timestamp: 0 },
    { id: 2, text: 'She lived in a very tall tower.', timestamp: 4 },
    { id: 3, text: 'One day, a dragon came...', timestamp: 8 }
  ];

  isPlaying = signal<boolean>(false);
  currentTime = signal<number>(4); // Default highlighted line 2
  duration = 12; // 12 seconds preview loop
  activeLineId = signal<number>(2);

  private timerInterval: any = null;

  togglePlay(): void {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }

  play(): void {
    this.isPlaying.set(true);
    this.timerInterval = setInterval(() => {
      let current = this.currentTime() + 0.1;
      if (current >= this.duration) {
        current = 0;
      }
      this.currentTime.set(current);
      this.updateActiveLine(current);
    }, 100);
  }

  pause(): void {
    this.isPlaying.set(false);
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  skip(seconds: number): void {
    let target = this.currentTime() + seconds;
    if (target < 0) target = 0;
    if (target > this.duration) target = this.duration;
    this.currentTime.set(target);
    this.updateActiveLine(target);
  }

  selectLine(line: TranscriptLine): void {
    this.currentTime.set(line.timestamp);
    this.activeLineId.set(line.id);
  }

  onProgressClick(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const ratio = clickX / rect.width;
    const targetTime = ratio * this.duration;
    this.currentTime.set(targetTime);
    this.updateActiveLine(targetTime);
  }

  progressPercent(): number {
    return (this.currentTime() / this.duration) * 100;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  private updateActiveLine(time: number): void {
    if (time < 4) {
      this.activeLineId.set(1);
    } else if (time < 8) {
      this.activeLineId.set(2);
    } else {
      this.activeLineId.set(3);
    }
  }

  ngOnDestroy(): void {
    this.pause();
  }
}
