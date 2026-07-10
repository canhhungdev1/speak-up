import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-interactive-transcript',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="interactive-transcript">
      <div 
        class="transcript-line" 
        *ngFor="let line of transcripts"
        [class.active]="currentTime >= line.startTime && currentTime <= line.endTime"
        (click)="onLineClick(line.startTime)"
        [title]="'SET_DETAIL.CLICK_TO_PLAY' | translate">
        
        <span class="text-content">{{ line.textContent }}</span>
        
      </div>
      <div class="empty-state" *ngIf="transcripts.length === 0">
        {{ 'SET_DETAIL.NO_SUBTITLE' | translate }}
      </div>
    </div>
  `,
  styles: [`
    .interactive-transcript {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px;
    }
    .transcript-line {
      padding: 12px 16px;
      margin-bottom: 8px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 18px;
      line-height: 1.6;
      color: var(--text-secondary);
      
      &:hover {
        background-color: var(--bg-surface);
        color: var(--text-primary);
      }
      
      &.active {
        background-color: rgba(59, 130, 246, 0.1);
        color: var(--course-blue);
        font-weight: 500;
        transform: scale(1.02);
      }
    }
    .empty-state { text-align: center; color: var(--text-muted); padding: 40px; }
  `]
})
export class InteractiveTranscriptComponent {
  @Input() transcripts: any[] = [];
  @Input() currentTime: number = 0;
  @Output() seekTime = new EventEmitter<number>();

  onLineClick(startTime: number) {
    this.seekTime.emit(startTime);
  }
}
