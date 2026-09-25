import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="auth-page">
      <!-- Background Ambient Glow -->
      <div class="ambient-glow"></div>

      <!-- Top Navigation: Back to Home & Theme Toggle -->
      <div class="auth-top-bar container">
        <a routerLink="/" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back to Home</span>
        </a>

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
      </div>

      <div class="auth-container">
        <!-- Left Panel: Inspirational Quote & Branding -->
        <div class="auth-branding-panel">
          <div class="branding-content">
            <!-- Brand Logo -->
            <a routerLink="/" class="logo">
              <span class="logo-text">Speak<span class="logo-accent">Up</span></span>
            </a>

            <h1 class="branding-title">
              Unlock your English potential.
            </h1>

            <!-- Quote Card -->
            <div class="quote-card">
              <p class="quote-text">
                "Language is not a genetic gift, it is a social gift. Learning a new language is becoming a member of the club – the community of speakers of that language."
              </p>
              <div class="quote-author">
                <div class="author-avatar">AJ</div>
                <div class="author-info">
                  <h4 class="author-name">A.J. Hoge</h4>
                  <p class="author-role">Creator of Effortless English</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel: Premium Glassmorphism Google Sign-In Card -->
        <div class="auth-form-panel">
          <div class="auth-card">
            <!-- Brand Logo for Mobile/Form -->
            <div class="card-logo-wrapper">
              <a routerLink="/" class="logo">
                <span class="logo-text">Speak<span class="logo-accent">Up</span></span>
              </a>
            </div>

            <!-- Welcome Header -->
            <div class="welcome-badge">
              <span class="badge">
                <span class="badge-dot"></span>
                1-CLICK AUTHENTICATION
              </span>
            </div>

            <h2 class="form-title">Welcome to SpeakUp</h2>
            <p class="form-subtitle">
              Sign in with your Google account to access your personalized Effortless English learning dashboard.
            </p>

            <!-- Single Premium Google OAuth Button -->
            <div class="google-action-box">
              <button type="button" class="btn-google-primary" (click)="onGoogleSignIn()">
                <div class="google-icon-box">
                  <svg class="google-icon" viewBox="0 0 24 24" width="22" height="22">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>
                <span class="btn-text">Tiếp tục sử dụng dịch vụ bằng Google</span>
              </button>
            </div>

            <!-- Security Assurance Note -->
            <div class="security-note">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Protected by Google OAuth 2.0. No passwords required.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      background-color: var(--bg-main);
      color: var(--text-main);
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    .ambient-glow {
      position: absolute;
      top: -20%;
      right: 15%;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(16, 185, 129, 0.06) 50%, transparent 70%);
      filter: blur(60px);
      pointer-events: none;
      z-index: 1;
    }

    .auth-top-bar {
      position: absolute;
      top: 24px;
      left: 0;
      right: 0;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      pointer-events: none;

      a, button {
        pointer-events: auto;
      }
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      transition: color 0.2s ease;

      &:hover {
        color: var(--primary);
      }
    }

    .theme-toggle {
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

      &:hover {
        transform: rotate(15deg) scale(1.08);
      }
    }

    .auth-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 100vh;
      width: 100%;
      position: relative;
      z-index: 2;
    }

    /* Left Panel: Branding & Quotes */
    .auth-branding-panel {
      background: linear-gradient(135deg, var(--bg-surface-hover) 0%, var(--bg-main) 100%);
      padding: 100px 60px 80px 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-right: 1px solid var(--border-color);
      color: var(--text-main);
      transition: background 0.3s ease, color 0.3s ease;
    }

    .branding-content {
      max-width: 480px;
      margin: 0 auto;
    }

    .logo {
      display: inline-block;
      text-decoration: none;
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--text-main);
      margin-bottom: 40px;
    }

    .logo-accent {
      color: var(--primary);
    }

    .branding-title {
      font-size: clamp(2.2rem, 3.8vw, 3.2rem);
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.03em;
      margin-bottom: 36px;
      color: var(--text-main);
    }

    .quote-card {
      background-color: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 28px;
      box-shadow: var(--shadow-sm);
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }

    .quote-text {
      font-size: 0.98rem;
      line-height: 1.6;
      color: var(--text-secondary);
      font-style: italic;
      margin-bottom: 24px;
    }

    .quote-author {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .author-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--gradient-primary);
      color: #FFFFFF;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.05rem;
    }

    .author-name {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .author-role {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    /* Right Panel: Premium Form Card */
    .auth-form-panel {
      padding: 100px 40px 80px 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .auth-card {
      background-color: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 28px;
      padding: 48px 40px;
      width: 100%;
      max-width: 440px;
      box-shadow: var(--shadow-lg);
      text-align: center;
      transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .card-logo-wrapper {
      display: none;
      margin-bottom: 24px;
    }

    .welcome-badge {
      margin-bottom: 20px;
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: var(--primary);
      display: inline-block;
      margin-right: 4px;
      animation: pulse 2s infinite;
    }

    .form-title {
      font-size: 2.1rem;
      font-weight: 800;
      color: var(--text-main);
      margin-bottom: 12px;
      letter-spacing: -0.025em;
    }

    .form-subtitle {
      font-size: 0.95rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 36px;
    }

    .google-action-box {
      margin-bottom: 28px;
    }

    .btn-google-primary {
      width: 100%;
      padding: 14px 20px;
      background-color: var(--bg-surface);
      border: 1.5px solid var(--border-color);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        background-color: var(--bg-surface-hover);
        border-color: var(--primary);
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
      }

      &:active {
        transform: translateY(-1px);
      }
    }

    .google-icon-box {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-text {
      font-size: 0.98rem;
      font-weight: 700;
      color: var(--text-main);
      letter-spacing: -0.01em;
    }

    .security-note {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 500;
      padding: 10px 16px;
      border-radius: 9999px;
      background-color: var(--bg-main);
      border: 1px solid var(--border-color);
      width: 100%;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.3); }
    }

    @media (max-width: 900px) {
      .auth-container {
        grid-template-columns: 1fr;
      }
      .auth-branding-panel {
        display: none;
      }
      .card-logo-wrapper {
        display: block;
      }
      .auth-form-panel {
        padding: 100px 20px 40px 20px;
      }
      .auth-card {
        padding: 36px 24px;
      }
    }
  `]
})
export class AuthComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);

  onGoogleSignIn(): void {
    this.authService.promptGoogleSignIn();
  }
}
