import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-page">
      <!-- Top Navigation -->
      <header class="dash-header">
        <div class="container dash-nav">
          <a routerLink="/" class="logo">
            <span class="logo-text">Speak<span class="logo-accent">Up</span></span>
          </a>

          <div class="user-profile">
            <img [src]="authService.currentUser()?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'" alt="User Avatar" class="user-avatar" />
            <span class="user-name">{{ authService.currentUser()?.name || 'Student' }}</span>
            <button class="btn btn-secondary btn-sm" (click)="authService.logout()">Logout</button>
          </div>
        </div>
      </header>

      <!-- Dashboard Main -->
      <main class="container dash-content">
        <div class="welcome-banner">
          <span class="badge">DEV MOCK LOGGED IN</span>
          <h1>Welcome back, {{ authService.currentUser()?.name }}! 👋</h1>
          <p>Ready to continue your Effortless English journey today?</p>
        </div>

        <div class="modules-grid">
          <div class="module-card active">
            <div class="card-icon">🎧</div>
            <h3>Module 1: Dragons (Mini-Story)</h3>
            <p>Master natural past tense answers with A.J. Hoge.</p>
            <button class="btn btn-primary btn-sm">Start Lesson 🚀</button>
          </div>

          <div class="module-card">
            <div class="card-icon">📚</div>
            <h3>Module 2: Vocabulary Context</h3>
            <p>Learn 15 key expressions without memorizing definitions.</p>
            <button class="btn btn-secondary btn-sm">Locked 🔒</button>
          </div>

          <div class="module-card">
            <div class="card-icon">🔄</div>
            <h3>Module 3: Point of View Stories</h3>
            <p>Experience grammar shifts naturally from Present to Future.</p>
            <button class="btn btn-secondary btn-sm">Locked 🔒</button>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-page {
      min-height: 100vh;
      background-color: var(--bg-main);
    }

    .dash-header {
      height: 72px;
      border-bottom: 1px solid var(--border-color);
      background-color: var(--bg-surface);
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

    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;

      .user-avatar {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 2px solid var(--primary);
      }

      .user-name {
        font-weight: 700;
        font-size: 0.92rem;
      }
    }

    .btn-sm {
      padding: 6px 14px;
      font-size: 0.85rem;
      border-radius: 8px;
    }

    .dash-content {
      padding: 48px 24px;
    }

    .welcome-banner {
      background-color: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 24px;
      padding: 40px;
      margin-bottom: 40px;

      h1 {
        font-size: 2.2rem;
        font-weight: 800;
        margin: 12px 0 8px 0;
      }

      p {
        color: var(--text-secondary);
        font-size: 1.05rem;
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
      align-items: flex-start;
      gap: 12px;

      .card-icon {
        font-size: 2.5rem;
      }

      h3 {
        font-size: 1.15rem;
        font-weight: 700;
      }

      p {
        font-size: 0.9rem;
        color: var(--text-secondary);
        line-height: 1.5;
        flex-grow: 1;
      }

      &.active {
        border-color: var(--primary);
        box-shadow: var(--shadow-md);
      }
    }

    @media (max-width: 900px) {
      .modules-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent {
  authService = inject(AuthService);
}
