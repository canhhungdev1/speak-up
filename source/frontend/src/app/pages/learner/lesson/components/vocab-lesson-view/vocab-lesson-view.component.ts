import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vocab-lesson-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="vocab-container">
      <div class="vocab-card" *ngFor="let vocab of transcripts">
        <div class="vocab-word">{{ getWord(vocab.textContent) }}</div>
        <div class="vocab-meaning">{{ getMeaning(vocab.textContent) }}</div>
      </div>
      <div class="empty-state" *ngIf="transcripts.length === 0">
        Bài học này chưa có từ vựng.
      </div>
    </div>
  `,
  styles: [`
    .vocab-container {
      max-width: 800px; margin: 0 auto; padding: 24px;
      display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;
    }
    .vocab-card {
      background-color: var(--bg-surface); border: 1px solid var(--border-color);
      border-radius: 12px; padding: 20px;
    }
    .vocab-word { font-size: 20px; font-weight: 700; color: var(--course-blue); margin-bottom: 8px; }
    .vocab-meaning { font-size: 16px; color: var(--text-primary); line-height: 1.5; }
    .empty-state { grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px; }
    
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

  // Mocking parsing logic: Format "Word - Meaning"
  getWord(text: string): string {
    return text.split(' - ')[0] || text;
  }
  
  getMeaning(text: string): string {
    return text.split(' - ')[1] || '';
  }
}
