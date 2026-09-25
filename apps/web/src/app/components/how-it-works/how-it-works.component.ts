import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

export interface StepItem {
  number: string;
  title: string;
  description: string;
  iconSvg: string;
}

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  template: `
    <section id="how-it-works" class="how-section" appScrollReveal>
      <div class="container">
        <!-- Section Header -->
        <div class="section-header">
          <h2 class="section-title">How It Works</h2>
          <p class="section-subtitle">Follow our proven 4-step daily study roadmap to achieve confident spoken English.</p>
        </div>

        <!-- 4 Steps Roadmap Grid -->
        <div class="steps-grid">
          @for (step of steps; track step.number) {
            <div class="step-card">
              <!-- Big Number Overlay -->
              <span class="step-number">{{ step.number }}</span>

              <div class="step-content">
                <div class="step-icon">
                  @switch (step.number) {
                    @case ('01') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                    }
                    @case ('02') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2v20"></path>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    }
                    @case ('03') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    }
                    @case ('04') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21.5 2v6h-6"></path>
                        <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                      </svg>
                    }
                  }
                </div>
                <h3 class="step-title">{{ step.title }}</h3>
                <p class="step-description">{{ step.description }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .how-section {
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

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }

    .step-card {
      background-color: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 36px 24px 28px 24px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.3s ease, box-shadow 0.3s ease;

      &:hover {
        transform: translateY(-6px);
        box-shadow: var(--shadow-lg);
      }
    }

    .step-number {
      position: absolute;
      top: 10px;
      right: 16px;
      font-size: 4.5rem;
      font-weight: 800;
      line-height: 1;
      color: var(--text-muted);
      opacity: 0.15;
      user-select: none;
      font-feature-settings: "tnum";
    }

    .step-content {
      position: relative;
      z-index: 2;
    }

    .step-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background-color: var(--primary-light);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .step-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 12px;
    }

    .step-description {
      font-size: 0.92rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    @media (max-width: 1024px) {
      .steps-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .steps-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HowItWorksComponent {
  steps: StepItem[] = [
    {
      number: '01',
      title: 'Listen & Read',
      description: 'Listen to the Main Audio while reading the transcript. Understand the story and lookup new words in context.',
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`
    },
    {
      number: '02',
      title: 'Understand Deeply',
      description: 'Listen to the Vocabulary Lesson. Understand new words deeply through English explanations, not translation.',
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`
    },
    {
      number: '03',
      title: 'Answer & Respond',
      description: 'Listen to the Mini-Story. A.J. Hoge asks easy questions rapidly; you must shout out the answers immediately.',
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`
    },
    {
      number: '04',
      title: 'Master Grammar',
      description: 'Listen to Point of View stories. Experience grammar tenses changing naturally without studying rules.',
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6"></path><path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>`
    }
  ];
}
