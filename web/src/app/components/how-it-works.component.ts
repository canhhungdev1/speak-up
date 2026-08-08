import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    section { padding: 50px 0 90px 0; }
    
    .feature-card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 24px;
      padding: 32px 26px;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01);
    }
    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px -15px rgba(0,0,0,0.08);
    }
    .dark .feature-card { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2); }
    .dark .feature-card:hover { box-shadow: 0 20px 40px -15px rgba(0,0,0,0.4); }
    
    .feature-number {
      position: absolute;
      top: 16px;
      right: 20px;
      font-size: 72px;
      font-weight: 800;
      color: var(--primary-color);
      opacity: 0.05;
      z-index: 0;
      line-height: 1;
      letter-spacing: -0.05em;
    }
    .dark .feature-number { opacity: 0.12; }
    
    .icon-box {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      position: relative;
      z-index: 1;
    }
    .feature-card h3 {
      font-size: 17px;
      margin-bottom: 12px;
      font-weight: 800;
      position: relative;
      z-index: 1;
      letter-spacing: -0.01em;
      color: var(--text-primary);
    }
    .feature-card p {
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.6;
      position: relative;
      z-index: 1;
      font-weight: 500;
    }
    
    .c1 { background: rgba(59, 130, 246, 0.12); color: #3b82f6; }
    .c2 { background: rgba(236, 72, 153, 0.12); color: #ec4899; }
    .c3 { background: rgba(249, 115, 22, 0.12); color: #f97316; }
    .c4 { background: rgba(139, 92, 246, 0.12); color: #8b5cf6; }
  `],
  template: `
    <section id="how-it-works">
      <div class="container">
        <h2 class="section-title">How It Works</h2>
        <p class="section-subtitle">Follow our proven 4-step daily study roadmap to achieve confident spoken English.</p>
        
        <div class="feature-grid">
          <!-- Step 1 -->
          <div class="feature-card">
            <div class="feature-number">01</div>
            <div class="icon-box c1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <h3>Listen & Read</h3>
            <p>Listen to the Main Audio while reading the transcript. Understand the story and lookup new words in context.</p>
          </div>

          <!-- Step 2 -->
          <div class="feature-card">
            <div class="feature-number">02</div>
            <div class="icon-box c2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3>Understand Deeply</h3>
            <p>Listen to the Vocabulary Lesson. Understand new words deeply through English explanations, not translation.</p>
          </div>

          <!-- Step 3 -->
          <div class="feature-card">
            <div class="feature-number">03</div>
            <div class="icon-box c3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="22"></line>
              </svg>
            </div>
            <h3>Answer & Respond</h3>
            <p>Listen to the Mini-Story. AJ Hoge asks easy questions rapidly; you must shout out the answers immediately.</p>
          </div>

          <!-- Step 4 -->
          <div class="feature-card">
            <div class="feature-number">04</div>
            <div class="icon-box c4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
            </div>
            <h3>Master Grammar</h3>
            <p>Listen to Point of View stories. Experience grammar tenses changing naturally without studying rules.</p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HowItWorksComponent {}
