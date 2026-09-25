import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-page">
      <!-- Top Student Navbar -->
      <header class="dash-header">
        <div class="container dash-nav">
          <a routerLink="/" class="logo">
            <span class="logo-text">Speak<span class="logo-accent">Up</span></span>
          </a>

          <div class="dash-actions">
            <!-- Daily Streak & Points Badges -->
            <div class="stats-badge streak-badge" title="Daily Learning Streak">
              🔥 <span>3 Days Streak</span>
            </div>
            <div class="stats-badge xp-badge" title="Experience Points">
              ⭐ <span>120 XP</span>
            </div>

            <!-- Theme Toggle Button -->
            <button 
              type="button" 
              class="btn-icon theme-toggle" 
              (click)="themeService.toggleTheme()"
              [attr.aria-label]="themeService.currentTheme() === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
              [title]="themeService.currentTheme() === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            >
              @if (themeService.currentTheme() === 'dark') {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="4"></circle>
                  <path d="M12 2v2"></path>
                  <path d="M12 20v2"></path>
                  <path d="m4.93 4.93 1.41 1.41"></path>
                  <path d="m17.66 17.66 1.41 1.41"></path>
                  <path d="M2 12h2"></path>
                  <path d="M20 12h2"></path>
                  <path d="m6.34 17.66-1.41 1.41"></path>
                  <path d="m19.07 4.93-1.41 1.41"></path>
                </svg>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                </svg>
              }
            </button>

            <!-- User Profile Dropdown / Logout -->
            <div class="user-profile">
              <img 
                [src]="authService.currentUser()?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=GoogleStudent'" 
                alt="Google Avatar" 
                class="user-avatar" 
              />
              <div class="user-info-text">
                <span class="user-name">{{ authService.currentUser()?.name || 'Google Student' }}</span>
                <span class="user-email">{{ authService.currentUser()?.email || 'student@gmail.com' }}</span>
              </div>
              <button type="button" class="btn btn-secondary btn-sm logout-btn" (click)="authService.logout()" title="Logout">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Dashboard Main Content -->
      <main class="container dash-content">
        <!-- Welcome Hero Banner -->
        <div class="welcome-banner">
          <div class="banner-badge">
            <span class="badge">GOOGLE AUTHENTICATED</span>
          </div>
          <h1 class="banner-title">Welcome back, {{ authService.currentUser()?.name }}! 👋</h1>
          <p class="banner-subtitle">
            Your Effortless English learning goal for today is <strong>1 Mini-Story Q&A lesson</strong>. Learn with your ears, not your eyes.
          </p>
        </div>

        <!-- Featured Focus Lesson Card -->
        <div class="focus-lesson-card">
          <div class="focus-meta">
            <div class="lesson-tag">TODAY'S RECOMMENDED LESSON</div>
            <h2 class="lesson-title">Dragons (Mini-Story Q&A)</h2>
            <p class="lesson-desc">
              Listen to A.J. Hoge ask rapid questions about the princess and the dragon. Answer out loud immediately!
            </p>
            <div class="lesson-progress-row">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 65%;"></div>
              </div>
              <span class="progress-text">65% Completed</span>
            </div>
          </div>
          <div class="focus-action">
            <button type="button" class="btn btn-primary btn-lg continue-btn" (click)="onContinueLesson()">
              Continue Learning 🎧
            </button>
          </div>
        </div>

        <!-- Course Library Grid -->
        <div class="section-title-row">
          <h3>Effortless English Stories Library</h3>
          <span class="library-count">4 Lessons Available</span>
        </div>

        <div class="modules-grid">
          <div class="module-card active">
            <div class="card-header">
              <span class="module-number">01</span>
              <span class="status-chip active">In Progress</span>
            </div>
            <h4 class="card-title">Dragons</h4>
            <p class="card-desc">Master natural past tense answers with A.J. Hoge's rapid questions.</p>
            <div class="card-pillars">
              <span class="pillar-tag">Main Audio</span>
              <span class="pillar-tag">Vocab</span>
              <span class="pillar-tag active">Mini-Story</span>
              <span class="pillar-tag">POV</span>
            </div>
          </div>

          <div class="module-card">
            <div class="card-header">
              <span class="module-number">02</span>
              <span class="status-chip">Next Up</span>
            </div>
            <h4 class="card-title">A Kiss</h4>
            <p class="card-desc">Carlos buys a new car. Learn 15 key English expressions in context.</p>
            <div class="card-pillars">
              <span class="pillar-tag">Main Audio</span>
              <span class="pillar-tag">Vocab</span>
              <span class="pillar-tag">Mini-Story</span>
              <span class="pillar-tag">POV</span>
            </div>
          </div>

          <div class="module-card">
            <div class="card-header">
              <span class="module-number">03</span>
              <span class="status-chip">Locked</span>
            </div>
            <h4 class="card-title">The Race</h4>
            <p class="card-desc">Allen is riding his motorcycle in San Francisco. Experience natural grammar shifts.</p>
            <div class="card-pillars">
              <span class="pillar-tag">Main Audio</span>
              <span class="pillar-tag">Vocab</span>
              <span class="pillar-tag">Mini-Story</span>
              <span class="pillar-tag">POV</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-page {
      min-height: 100vh;
      background-color: var(--bg-main);
      color: var(--text-main);
      transition: background-color 0.3s ease;
    }

    .dash-header {
      height: 76px;
      border-bottom: 1px solid var(--border-color);
      background-color: var(--bg-surface);
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    .dash-nav {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-main);
    }
    .logo-accent { color: var(--primary); }

    .dash-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stats-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 700;
      border: 1px solid var(--border-color);
      background-color: var(--bg-main);
    }

    .streak-badge {
      color: #F97316;
      border-color: rgba(249, 115, 22, 0.2);
    }

    .xp-badge {
      color: #F59E0B;
      border-color: rgba(245, 158, 11, 0.2);
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-left: 8px;

      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid var(--primary);
        object-fit: cover;
      }

      .user-info-text {
        display: flex;
        flex-direction: column;

        .user-name {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-main);
          line-height: 1.2;
        }

        .user-email {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
      }
    }

    .logout-btn {
      margin-left: 4px;
      padding: 6px 12px;
      font-size: 0.8rem;
    }

    .dash-content {
      padding: 40px 24px 80px 24px;
    }

    .welcome-banner {
      background: linear-gradient(135deg, var(--bg-surface-hover) 0%, var(--bg-surface) 100%);
      border: 1px solid var(--border-color);
      border-radius: 24px;
      padding: 36px 40px;
      margin-bottom: 32px;

      .banner-badge {
        margin-bottom: 12px;
      }

      .banner-title {
        font-size: clamp(1.8rem, 3vw, 2.4rem);
        font-weight: 800;
        letter-spacing: -0.02em;
        margin-bottom: 8px;
        color: var(--text-main);
      }

      .banner-subtitle {
        color: var(--text-secondary);
        font-size: 1.05rem;
      }
    }

    .focus-lesson-card {
      background-color: var(--bg-surface);
      border: 2px solid var(--primary);
      border-radius: 24px;
      padding: 36px 40px;
      margin-bottom: 48px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
      box-shadow: var(--shadow-glow);
    }

    .focus-meta {
      max-width: 600px;

      .lesson-tag {
        font-size: 0.75rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        color: var(--primary);
        margin-bottom: 8px;
      }

      .lesson-title {
        font-size: 1.6rem;
        font-weight: 800;
        margin-bottom: 8px;
      }

      .lesson-desc {
        color: var(--text-secondary);
        font-size: 0.95rem;
        margin-bottom: 20px;
        line-height: 1.5;
      }
    }

    .lesson-progress-row {
      display: flex;
      align-items: center;
      gap: 16px;

      .progress-bar {
        flex-grow: 1;
        height: 8px;
        background-color: var(--border-color);
        border-radius: 9999px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: var(--gradient-primary);
        border-radius: 9999px;
      }

      .progress-text {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--primary);
      }
    }

    .continue-btn {
      padding: 16px 32px;
      font-size: 1.05rem;
      white-space: nowrap;
    }

    .section-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;

      h3 {
        font-size: 1.4rem;
        font-weight: 800;
      }

      .library-count {
        font-size: 0.88rem;
        color: var(--text-muted);
        font-weight: 600;
      }
    }

    .modules-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .module-card {
      background-color: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: transform 0.25s ease, box-shadow 0.25s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .module-number {
        font-size: 1.2rem;
        font-weight: 800;
        color: var(--text-muted);
      }

      .status-chip {
        font-size: 0.75rem;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 9999px;
        background-color: var(--bg-main);
        color: var(--text-muted);

        &.active {
          background-color: var(--primary-light);
          color: var(--primary);
        }
      }

      .card-title {
        font-size: 1.2rem;
        font-weight: 800;
      }

      .card-desc {
        font-size: 0.9rem;
        color: var(--text-secondary);
        line-height: 1.5;
        flex-grow: 1;
      }

      .card-pillars {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-top: 8px;
      }

      .pillar-tag {
        font-size: 0.72rem;
        padding: 3px 8px;
        border-radius: 6px;
        background-color: var(--bg-main);
        color: var(--text-muted);
        font-weight: 600;

        &.active {
          background-color: var(--primary);
          color: #FFFFFF;
        }
      }
    }

    @media (max-width: 992px) {
      .focus-lesson-card {
        flex-direction: column;
        align-items: flex-start;
      }
      .modules-grid {
        grid-template-columns: 1fr;
      }
      .user-info-text {
        display: none !important;
      }
    }
  `]
})
export class DashboardComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);

  onContinueLesson(): void {
    alert('🎯 Màn hình Trình học Tương tác Mini-Story Q&A (Lesson Workspace) sắp sẵn sàng!');
  }
}
