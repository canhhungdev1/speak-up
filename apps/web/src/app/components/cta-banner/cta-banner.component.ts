import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-cta-banner',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  template: `
    <section class="cta-section" appScrollReveal>
      <div class="container">
        <div class="cta-card">
          <!-- Glow background effect -->
          <div class="glow-effect"></div>

          <div class="cta-content">
            <span class="cta-badge">GET STARTED TODAY</span>
            <h2 class="cta-title">Ready to Speak English Effortlessly?</h2>
            <p class="cta-subtitle">
              Join thousands of students who have achieved fluency through the Effortless English method. Learn with your ears, not your eyes.
            </p>
            <a routerLink="/login" class="btn cta-btn">
              Start Learning Now 🚀
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .cta-section {
      padding: 60px 0 100px 0;
      background-color: var(--bg-main);
    }

    .cta-card {
      position: relative;
      background: linear-gradient(135deg, #07191E 0%, #0B2B28 50%, #081B26 100%);
      border-radius: 32px;
      padding: 80px 40px;
      text-align: center;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .glow-effect {
      position: absolute;
      top: -50%;
      left: 50%;
      transform: translateX(-50%);
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(59, 130, 246, 0.15) 50%, transparent 70%);
      pointer-events: none;
      filter: blur(40px);
    }

    .cta-content {
      position: relative;
      z-index: 2;
      max-width: 640px;
      margin: 0 auto;
    }

    .cta-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: #34D399;
      background-color: rgba(52, 211, 153, 0.1);
      padding: 6px 16px;
      border-radius: 9999px;
      border: 1px solid rgba(52, 211, 153, 0.2);
      margin-bottom: 24px;
    }

    .cta-title {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: -0.02em;
      line-height: 1.2;
      margin-bottom: 20px;
    }

    .cta-subtitle {
      font-size: 1.05rem;
      color: #94A3B8;
      line-height: 1.6;
      margin-bottom: 36px;
    }

    .cta-btn {
      background-color: #FFFFFF;
      color: #0F172A;
      font-weight: 700;
      font-size: 1.05rem;
      padding: 16px 36px;
      border-radius: 14px;
      box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2);
      transition: transform 0.25s ease, box-shadow 0.25s ease;

      &:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 8px 30px rgba(255, 255, 255, 0.35);
        background-color: #FFFFFF;
      }
    }
  `]
})
export class CtaBannerComponent {}
