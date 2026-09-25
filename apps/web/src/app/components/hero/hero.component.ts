import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AudioPlayerWidgetComponent } from '../audio-player-widget/audio-player-widget.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink, AudioPlayerWidgetComponent],
  template: `
    <section class="hero-section">
      <div class="container hero-grid">
        <!-- Left Content -->
        <div class="hero-content">
          <!-- Badge -->
          <div class="badge-wrapper">
            <span class="badge">
              Master English Naturally 🚀
            </span>
          </div>

          <!-- Main Heading -->
          <h1 class="hero-title">
            Stop Studying Grammar.<br>
            Start <span class="text-gradient">Speaking</span> English.
          </h1>

          <!-- Subtitle -->
          <p class="hero-subtitle">
            Join thousands of students who have achieved fluency through the Effortless English method. Learn with your ears, not your eyes.
          </p>

          <!-- Action Buttons -->
          <div class="hero-actions">
            <a routerLink="/login" class="btn btn-primary btn-lg">
              Start Learning Now 🚀
            </a>
            <a href="#how-it-works" class="btn btn-secondary btn-lg">
              Listen Preview 🎧
            </a>
          </div>
        </div>

        <!-- Right Visual Audio Widget -->
        <div class="hero-visual">
          <app-audio-player-widget></app-audio-player-widget>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      padding: 80px 0 100px 0;
      position: relative;
      overflow: hidden;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      align-items: center;
      gap: 60px;
    }

    .hero-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .badge-wrapper {
      margin-bottom: 24px;
    }

    .hero-title {
      font-size: clamp(2.4rem, 5.2vw, 4rem);
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.03em;
      color: var(--text-main);
      margin-bottom: 24px;
    }

    .hero-subtitle {
      font-size: 1.15rem;
      line-height: 1.6;
      color: var(--text-secondary);
      margin-bottom: 40px;
      max-width: 540px;
    }

    .hero-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .btn-lg {
      padding: 16px 32px;
      font-size: 1.05rem;
      border-radius: 14px;
    }

    .hero-visual {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    @media (max-width: 992px) {
      .hero-grid {
        grid-template-columns: 1fr;
        gap: 48px;
        text-align: center;
      }

      .hero-content {
        align-items: center;
      }

      .hero-subtitle {
        max-width: 100%;
      }

      .hero-actions {
        justify-content: center;
      }
    }
  `]
})
export class HeroComponent {}
