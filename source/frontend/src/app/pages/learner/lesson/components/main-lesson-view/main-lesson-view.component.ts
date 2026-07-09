import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-lesson-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="main-article">
      <p *ngFor="let line of transcripts">
        {{ line.textContent }}
      </p>
      <div class="empty-state" *ngIf="transcripts.length === 0">
        Bài đọc chưa có nội dung.
      </div>
    </div>
  `,
  styles: [`
    .main-article {
      max-width: 800px; margin: 0 auto; padding: 32px 24px;
      background-color: var(--bg-surface); border-radius: 16px;
      box-shadow: var(--shadow-sm);
    }
    p {
      font-size: 18px; line-height: 1.8; color: var(--text-primary);
      margin-bottom: 16px;
    }
    .empty-state { text-align: center; color: var(--text-muted); padding: 40px; }
  `]
})
export class MainLessonViewComponent {
  @Input() transcripts: any[] = [];
}
