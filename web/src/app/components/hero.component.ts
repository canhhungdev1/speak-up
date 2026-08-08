import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [`
    .hero { padding: 160px 0 90px 0; }
    .hero-container {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 40px;
      align-items: center;
    }
    
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: var(--badge-bg);
      color: var(--badge-text);
      border-radius: 99px;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 24px;
      border: 1px solid var(--badge-border);
    }
    
    .hero-content h1 {
      font-size: 60px;
      font-weight: 800;
      line-height: 1.15;
      margin-bottom: 24px;
      color: var(--text-primary);
      letter-spacing: -0.035em;
    }

    .hero-title-line3 {
      white-space: nowrap;
      display: inline-block;
    }

    .hero-content p {
      font-size: 16px;
      color: var(--text-secondary);
      margin-bottom: 36px;
      max-width: 480px;
      line-height: 1.6;
      font-weight: 500;
    }
    
    .hero-actions {
      display: flex;
      gap: 14px;
      align-items: center;
    }

    .btn-watch {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 24px;
      border-radius: 99px;
      font-weight: 600;
      font-size: 15px;
      color: var(--text-primary);
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      transition: all 0.2s ease;
    }
    .btn-watch:hover {
      background: var(--bg-color);
      border-color: var(--text-muted);
    }
    
    .audio-card-wrapper {
      perspective: 1200px;
      display: flex;
      justify-content: flex-end;
    }
    
    .audio-card {
      width: 340px;
      background: var(--surface-color);
      border-radius: 24px;
      padding: 28px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--border-color);
      transform-style: preserve-3d;
      will-change: transform;
      cursor: pointer;
    }

    .audio-card.floating {
      animation: float 7s ease-in-out infinite;
    }
    
    .audio-card.hovered {
      box-shadow: 0 35px 70px -15px rgba(0, 0, 0, 0.18);
      transition: transform 0.1s ease-out, box-shadow 0.3s ease;
    }

    .dark .audio-card {
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .dark .audio-card.hovered {
      box-shadow: 0 35px 75px -15px rgba(0, 0, 0, 0.85);
    }
    
    @keyframes float {
      0%, 100% { transform: perspective(1200px) rotateY(-10deg) rotateX(6deg) translateY(0); }
      50% { transform: perspective(1200px) rotateY(-10deg) rotateX(6deg) translateY(-14px); }
    }
    
    .track-info {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      transform: translateZ(20px);
    }
    .track-cover {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #f97316, #ea580c);
      border-radius: 12px;
      margin-right: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 8px 16px rgba(249, 115, 22, 0.3);
    }
    .track-title {
      font-size: 15px;
      font-weight: 800;
      margin-bottom: 2px;
      color: var(--text-primary);
    }
    .track-author {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 500;
    }
    
    .transcript {
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 24px;
      line-height: 1.8;
      font-weight: 500;
      transform: translateZ(15px);
    }
    .transcript strong {
      color: var(--text-primary);
      font-weight: 700;
    }
    
    .progress-bar {
      height: 4px;
      background: var(--border-color);
      border-radius: 2px;
      margin-bottom: 24px;
      position: relative;
      transform: translateZ(10px);
    }
    .progress-fill {
      position: absolute;
      left: 0; top: 0;
      height: 100%;
      width: 40%;
      background: var(--primary-color);
      border-radius: 2px;
    }
    
    .controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 32px;
      color: var(--text-muted);
      transform: translateZ(25px);
    }
    .controls svg {
      cursor: pointer;
      transition: color 0.2s, transform 0.2s;
    }
    .controls svg:hover {
      color: var(--text-primary);
      transform: scale(1.15);
    }
    .controls .play-btn {
      color: var(--primary-color);
    }

    @media (max-width: 1024px) {
      .hero-content h1 { font-size: 48px; }
      .hero-title-line3 { white-space: normal; }
      .hero-container { grid-template-columns: 1fr; text-align: center; }
      .hero-content p { margin-left: auto; margin-right: auto; }
      .hero-actions { justify-content: center; }
      .audio-card-wrapper { justify-content: center; margin-top: 40px; }
    }
  `],
  template: `
    <section class="hero">
      <div class="container hero-container">
        <div class="hero-content">
          <div class="badge">Master English Naturally 🚀</div>
          <h1>Stop Studying<br>Grammar.<br><span class="hero-title-line3">Start <span class="text-gradient">Speaking</span> English.</span></h1>
          <p>Join thousands of students who have achieved fluency through the Effortless English method. Learn with your ears, not your eyes.</p>
          <div class="hero-actions">
            <button class="btn btn-primary" routerLink="/login">Go to Dashboard 🚀</button>
            <button class="btn-watch">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Watch Demo
            </button>
          </div>
        </div>
        
        <div class="audio-card-wrapper">
          <div 
            class="audio-card"
            [class.floating]="!isHovered"
            [class.hovered]="isHovered"
            [style.transform]="isHovered ? cardTransform : null"
            (mousemove)="onMouseMove($event)"
            (mouseleave)="onMouseLeave()">
            
            <div class="track-info">
              <div class="track-cover">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18V5l12-2v13"></path>
                  <circle cx="6" cy="18" r="3"></circle>
                  <circle cx="18" cy="16" r="3"></circle>
                </svg>
              </div>
              <div>
                <div class="track-title">Dragons (Mini-Story)</div>
                <div class="track-author">A.J. Hoge</div>
              </div>
            </div>
            
            <div class="transcript">
              There was a beautiful princess.<br><br>
              <strong>She lived in a very tall tower.</strong><br><br>
              One day, a dragon came...
            </div>
            
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
            
            <div class="controls">
              <!-- Skip Back -->
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="19 20 9 12 19 4 19 20"></polygon>
                <line x1="5" y1="19" x2="5" y2="5"></line>
              </svg>
              <!-- Pause -->
              <svg class="play-btn" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                <rect x="14" y="4" width="4" height="16" rx="1"></rect>
              </svg>
              <!-- Skip Forward -->
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 4 15 12 5 20 5 4"></polygon>
                <line x1="19" y1="5" x2="19" y2="19"></line>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HeroComponent {
  cardTransform = '';
  isHovered = false;

  onMouseMove(event: MouseEvent) {
    this.isHovered = true;
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    // Calculate rotation angles based on cursor position
    const rotateX = -(y / (rect.height / 2)) * 18; // max +-18deg
    const rotateY = (x / (rect.width / 2)) * 18;  // max +-18deg

    this.cardTransform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  }

  onMouseLeave() {
    this.isHovered = false;
    this.cardTransform = '';
  }
}
