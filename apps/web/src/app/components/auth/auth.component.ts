import { Component, inject, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

declare const google: any;

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <!-- Back to Home Link -->
      <a routerLink="/" class="back-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Home
      </a>

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

        <!-- Right Panel: Login Form & OAuth Buttons -->
        <div class="auth-form-panel">
          <div class="form-wrapper">
            <h2 class="form-title">Welcome back</h2>
            <p class="form-subtitle">Enter your details to access your learning dashboard.</p>

            <!-- Status Notice -->
            <div *ngIf="authService.lastAuthNotice()" class="auth-notice">
              {{ authService.lastAuthNotice() }}
            </div>

            <!-- 1. Google OAuth Native GIS Button Container -->
            <div id="google-btn-container" class="google-btn-container"></div>

            <!-- Fallback Button if GIS has not loaded yet -->
            <button *ngIf="!googleBtnReady()" type="button" class="btn-google" (click)="onGoogleSignIn()" [disabled]="authService.isLoading()">
              <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{{ authService.isLoading() ? 'Đang xác thực...' : 'Tiếp tục sử dụng dịch vụ bằng Google' }}</span>
            </button>

            <!-- 2. Quick Dev Mock Login Button -->
            <button type="button" class="btn-dev-mock" (click)="onDevMockLogin()">
              <span class="lightning-icon">⚡</span>
              <span>Quick Dev Mock Login (Auto Sign-In)</span>
            </button>

            <!-- Divider -->
            <div class="divider">
              <span>OR CONTINUE WITH EMAIL</span>
            </div>

            <!-- Email & Password Form -->
            <form (ngSubmit)="onEmailSignIn()" class="email-form">
              <div class="form-group">
                <label for="email">Email address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  [(ngModel)]="email" 
                  placeholder="you@example.com"
                  required 
                  class="auth-input"
                />
              </div>

              <div class="form-group">
                <div class="password-label-row">
                  <label for="password">Password</label>
                  <a href="#" class="forgot-link" (click)="$event.preventDefault()">Forgot password?</a>
                </div>
                <div class="password-input-wrapper">
                  <input 
                    [type]="showPassword() ? 'text' : 'password'" 
                    id="password" 
                    name="password"
                    [(ngModel)]="password" 
                    placeholder="••••••••"
                    required 
                    class="auth-input"
                  />
                  <button type="button" class="toggle-password" (click)="showPassword.set(!showPassword())">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-submit">
                Sign in
              </button>
            </form>

            <p class="signup-footer">
              Don't have an account? <a href="#" (click)="$event.preventDefault()" class="signup-link">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      background-color: var(--bg-main);
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .back-link {
      position: absolute;
      top: 24px;
      left: 32px;
      z-index: 10;
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

    .auth-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 100vh;
      width: 100%;
    }

    /* Left Panel: Branding & Quotes */
    .auth-branding-panel {
      background: linear-gradient(135deg, #0B0F17 0%, #151D2A 100%);
      padding: 80px 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      color: #FFFFFF;
    }

    .branding-content {
      max-width: 500px;
      margin: 0 auto;
    }

    .logo {
      display: inline-block;
      text-decoration: none;
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: #FFFFFF;
      margin-bottom: 40px;
    }

    .logo-accent {
      color: var(--primary);
    }

    .branding-title {
      font-size: clamp(2.2rem, 4vw, 3.2rem);
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.02em;
      margin-bottom: 40px;
      color: #FFFFFF;
    }

    .quote-card {
      background-color: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 28px;
      backdrop-filter: blur(10px);
    }

    .quote-text {
      font-size: 0.98rem;
      line-height: 1.6;
      color: #94A3B8;
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
      color: #FFFFFF;
    }

    .author-role {
      font-size: 0.8rem;
      color: #64748B;
    }

    /* Right Panel: Form */
    .auth-form-panel {
      background-color: var(--bg-surface);
      padding: 80px 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .form-wrapper {
      width: 100%;
      max-width: 400px;
    }

    .form-title {
      font-size: 2rem;
      font-weight: 800;
      color: var(--text-main);
      margin-bottom: 8px;
      text-align: center;
    }

    .form-subtitle {
      font-size: 0.92rem;
      color: var(--text-secondary);
      text-align: center;
      margin-bottom: 32px;
    }

    .btn-google {
      width: 100%;
      padding: 12px 16px;
      background-color: var(--bg-main);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-main);
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 12px;

      &:hover {
        background-color: var(--bg-surface-hover);
        border-color: var(--text-muted);
      }
    }

    .btn-dev-mock {
      width: 100%;
      padding: 12px 16px;
      background-color: rgba(249, 115, 22, 0.08);
      border: 1px dashed rgba(249, 115, 22, 0.5);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 0.9rem;
      font-weight: 700;
      color: #F97316;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 24px;

      &:hover {
        background-color: rgba(249, 115, 22, 0.15);
        transform: scale(1.01);
      }
    }

    .divider {
      position: relative;
      text-align: center;
      margin: 24px 0;

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: var(--border-color);
      }

      span {
        position: relative;
        background-color: var(--bg-surface);
        padding: 0 12px;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        color: var(--text-muted);
      }
    }

    .email-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;

      label {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-main);
      }
    }

    .password-label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .forgot-link {
        font-size: 0.8rem;
        color: var(--primary);
        text-decoration: none;
        font-weight: 600;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .password-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .auth-input {
      width: 100%;
      padding: 12px 16px;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      background-color: var(--bg-main);
      color: var(--text-main);
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;

      &:focus {
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
      }
    }

    .toggle-password {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        color: var(--text-main);
      }
    }

    .btn-submit {
      width: 100%;
      padding: 14px;
      font-size: 1rem;
      margin-top: 8px;
    }

    .signup-footer {
      text-align: center;
      margin-top: 24px;
      font-size: 0.88rem;
      color: var(--text-secondary);

      .signup-link {
        color: var(--primary);
        font-weight: 700;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
      .google-btn-container {
        display: flex;
        justify-content: center;
        width: 100%;
        margin-bottom: 12px;
        min-height: 44px;

        > div {
          width: 100% !important;
          display: flex;
          justify-content: center;
        }
      }

      .auth-notice {
        padding: 10px 14px;
        margin-bottom: 16px;
        background-color: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.3);
        color: #2563eb;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        text-align: center;
      }
    }

    @media (max-width: 900px) {
      .auth-container {
        grid-template-columns: 1fr;
      }
      .auth-branding-panel {
        display: none;
      }
      .auth-form-panel {
        padding: 80px 24px 40px 24px;
      }
    }
  `]
})
export class AuthComponent implements AfterViewInit {
  authService = inject(AuthService);
  private readonly GOOGLE_CLIENT_ID = '996712067238-iuk0jcbrfjfcupqs4re96i1f2m8bg8hk.apps.googleusercontent.com';

  email = '';
  password = '';
  showPassword = signal<boolean>(false);
  googleBtnReady = signal<boolean>(false);

  ngAfterViewInit(): void {
    this.initGoogleAuth();
  }

  private initGoogleAuth(): void {
    if (typeof google !== 'undefined' && google.accounts?.id) {
      try {
        google.accounts.id.initialize({
          client_id: this.GOOGLE_CLIENT_ID,
          callback: (response: any) => this.handleGoogleCredential(response),
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        const container = document.getElementById('google-btn-container');
        if (container) {
          google.accounts.id.renderButton(container, {
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            width: 340,
          });
          this.googleBtnReady.set(true);
        }
      } catch (err) {
        console.warn('Không thể khởi tạo Google Identity Services Button:', err);
      }
    } else {
      // Thử lại sau 500ms nếu script Google chưa tải xong
      setTimeout(() => this.initGoogleAuth(), 500);
    }
  }

  private handleGoogleCredential(response: any): void {
    if (response && response.credential) {
      this.authService.googleLoginWithIdToken(response.credential);
    }
  }

  onGoogleSignIn(): void {
    if (typeof google !== 'undefined' && google.accounts?.id) {
      google.accounts.id.prompt();
    } else {
      this.authService.googleLogin(this.email || undefined);
    }
  }

  onDevMockLogin(): void {
    this.authService.mockLogin();
  }

  onEmailSignIn(): void {
    if (this.email) {
      this.authService.emailLogin(this.email);
    }
  }
}
