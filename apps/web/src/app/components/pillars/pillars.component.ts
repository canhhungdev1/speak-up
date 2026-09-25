import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

export interface PillarCard {
  id: string;
  iconSvg: string;
  title: string;
  description: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-pillars',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  template: `
    <section id="method" class="pillars-section" appScrollReveal>
      <div class="container">
        <!-- Section Header -->
        <div class="section-header">
          <h2 class="section-title">The 4 Pillars of Fluency</h2>
          <p class="section-subtitle">Follow our proven roadmap to achieve confident spoken English.</p>
        </div>

        <!-- 4 Pillars Grid -->
        <div class="pillars-grid">
          @for (pillar of pillars; track pillar.id) {
            <div 
              class="pillar-card" 
              [class.active]="pillar.isActive"
              (mousemove)="onMouseMove($event, $any($event.currentTarget))"
              (mouseleave)="onMouseLeave($any($event.currentTarget))"
            >
              <div class="icon-wrapper" [class.icon-active]="pillar.isActive">
                @switch (pillar.id) {
                  @case ('main-audio') {
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                    </svg>
                  }
                  @case ('vocab') {
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
                      <path d="M6 6h10"></path>
                      <path d="M6 10h10"></path>
                    </svg>
                  }
                  @case ('mini-story') {
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                  }
                  @case ('pov-story') {
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                      <path d="M3 3v5h5"></path>
                      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                      <path d="M16 16h5v5"></path>
                    </svg>
                  }
                }
              </div>
              <h3 class="card-title">{{ pillar.title }}</h3>
              <p class="card-description">{{ pillar.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .pillars-section {
      padding: 100px 0;
      background-color: var(--bg-main);
      position: relative;
    }

    .section-header {
      text-align: center;
      max-width: 640px;
      margin: 0 auto 64px auto;

      .section-title {
        font-size: clamp(2rem, 3.5vw, 2.75rem);
        font-weight: 800;
        color: var(--text-main);
        letter-spacing: -0.02em;
        margin-bottom: 16px;
      }

      .section-subtitle {
        font-size: 1.1rem;
        color: var(--text-secondary);
        line-height: 1.6;
      }
    }

    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      perspective: 1200px; /* 3D Parallax setup */
    }

    .pillar-card {
      background-color: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 32px 24px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.15s ease-out;
      transform-style: preserve-3d;
      will-change: transform;

      &:hover {
        box-shadow: var(--shadow-lg);
      }

      &.active {
        border: 2px solid var(--border-active);
        box-shadow: var(--shadow-glow);

        :host-context([data-theme="dark"]) &,
        :host-context(body.dark) & {
          border-color: var(--primary);
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
        }
      }
    }

    .icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background-color: var(--primary-light);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;

      &.icon-active {
        background: linear-gradient(135deg, #FF9900 0%, #FF6600 100%);
        color: #FFFFFF;
        box-shadow: 0 4px 14px rgba(255, 153, 0, 0.35);
      }
    }

    .card-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 12px;
    }

    .card-description {
      font-size: 0.92rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    @media (max-width: 1024px) {
      .pillars-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .pillars-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PillarsComponent {
  pillars: PillarCard[] = [
    {
      id: 'main-audio',
      title: 'Main Audio Article',
      description: 'Listen to fascinating stories and articles. Improve your listening comprehension naturally.',
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>`
    },
    {
      id: 'vocab',
      title: 'Vocabulary Lesson',
      description: 'Learn words in context through audio explanations, never memorize lists again.',
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path><path d="M6 6h10"></path><path d="M6 10h10"></path></svg>`
    },
    {
      id: 'mini-story',
      title: 'Mini-Story (Q&A)',
      description: 'The secret weapon. Answer fast-paced questions to train your brain to think in English.',
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
      isActive: true
    },
    {
      id: 'pov-story',
      title: 'Point of View Story',
      description: 'Master English grammar instinctively by listening to the same story in different tenses.',
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 16h5v5"></path></svg>`
    }
  ];

  // 3D Mouse Parallax Tilt implementation (from ui-web.md learning)
  onMouseMove(event: MouseEvent, cardElement: HTMLElement): void {
    const rect = cardElement.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    const maxDeg = 8; // Max tilt degrees

    const rotateX = -(y / (rect.height / 2)) * maxDeg;
    const rotateY = (x / (rect.width / 2)) * maxDeg;

    cardElement.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
  }

  onMouseLeave(cardElement: HTMLElement): void {
    cardElement.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
  }
}
