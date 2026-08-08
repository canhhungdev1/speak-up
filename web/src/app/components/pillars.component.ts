import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pillars',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    section { padding: 90px 0 50px 0; }
    
    .feature-card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 24px;
      padding: 32px 26px;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01);
    }
    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px -15px rgba(0,0,0,0.08);
    }
    .dark .feature-card { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2); }
    .dark .feature-card:hover { box-shadow: 0 20px 40px -15px rgba(0,0,0,0.4); }
    
    .icon-box {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
    }
    .feature-card h3 {
      font-size: 17px;
      margin-bottom: 12px;
      font-weight: 800;
      letter-spacing: -0.01em;
      color: var(--text-primary);
    }
    .feature-card p {
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.6;
      font-weight: 500;
    }
    
    .c1 { background: rgba(59, 130, 246, 0.12); color: #3b82f6; }
    .c2 { background: rgba(236, 72, 153, 0.12); color: #ec4899; }
    .c3 { background: rgba(249, 115, 22, 0.12); color: #f97316; }
    .c4 { background: rgba(139, 92, 246, 0.12); color: #8b5cf6; }
    
    .card-active {
      border-color: var(--primary-color);
      box-shadow: 0 10px 30px -10px rgba(59, 130, 246, 0.2);
    }
    .dark .card-active {
      border-color: rgba(59, 130, 246, 0.5);
      box-shadow: 0 10px 30px -10px rgba(59, 130, 246, 0.3);
    }
  `],
  template: `
    <section id="method">
      <div class="container">
        <h2 class="section-title">The 4 Pillars of Fluency</h2>
        <p class="section-subtitle">Follow our proven roadmap to achieve confident spoken English.</p>
        
        <div class="feature-grid">
          <!-- Card 1 -->
          <div class="feature-card">
            <div class="icon-box c1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 14u-1 0 0 1 1-1h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6z"></path>
                <path d="M18 14a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-6z"></path>
                <path d="M3 14V11a9 9 0 0 1 18 0v3"></path>
              </svg>
            </div>
            <h3>Main Audio Article</h3>
            <p>Listen to fascinating stories and articles. Improve your listening comprehension naturally.</p>
          </div>
          
          <!-- Card 2 -->
          <div class="feature-card">
            <div class="icon-box c2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <h3>Vocabulary Lesson</h3>
            <p>Learn words in context through audio explanations, never memorize lists again.</p>
          </div>
          
          <!-- Card 3 (Active) -->
          <div class="feature-card card-active">
            <div class="icon-box c3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <h3>Mini-Story (Q&A)</h3>
            <p>The secret weapon. Answer fast-paced questions to train your brain to think in English.</p>
          </div>
          
          <!-- Card 4 -->
          <div class="feature-card">
            <div class="icon-box c4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                <path d="M3 21v-5h5"></path>
              </svg>
            </div>
            <h3>Point of View Story</h3>
            <p>Master English grammar instinctively by listening to the same story in different tenses.</p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class PillarsComponent {}
