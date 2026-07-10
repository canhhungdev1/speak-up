import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-lesson-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="main-article">
      <!-- Hiển thị nội dung Quill Rich Text -->
      <div class="article-body" *ngIf="htmlContent" [innerHTML]="htmlContent"></div>
      
      <!-- Hỗ trợ dữ liệu dạng dòng chữ cũ nếu không có htmlContent -->
      <ng-container *ngIf="!htmlContent && transcripts.length > 0">
        <p *ngFor="let line of transcripts">
          {{ line.textContent }}
        </p>
      </ng-container>

      <div class="empty-state" *ngIf="!htmlContent && transcripts.length === 0">
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
    .article-body {
      font-size: 16px;
      line-height: 1.8;
      color: var(--text-primary);
      
      h1, h2, h3 {
        margin-top: 20px;
        margin-bottom: 12px;
        font-weight: 700;
      }
      p {
        margin-bottom: 16px;
      }
    }
    p {
      font-size: 18px; line-height: 1.8; color: var(--text-primary);
      margin-bottom: 16px;
    }
    .empty-state { text-align: center; color: var(--text-muted); padding: 40px; }
  `]
})
export class MainLessonViewComponent {
  @Input() htmlContent: string = '';
  @Input() transcripts: any[] = [];
}
