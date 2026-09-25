import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

declare const google: any;

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider?: 'google' | 'mock' | 'email';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private readonly USER_KEY = 'speakup_user';

  currentUser = signal<User | null>(this.getStoredUser());

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  /**
   * Initializes Google Identity Services API (gsi/client)
   */
  initGoogleOAuth(elementId: string): void {
    if (typeof google !== 'undefined' && google.accounts?.id) {
      try {
        google.accounts.id.initialize({
          client_id: environment.googleClientId,
          callback: (response: any) => this.handleGoogleCredentialResponse(response)
        });

        // Render the official Google Sign-In button if target element exists
        const targetElement = document.getElementById(elementId);
        if (targetElement) {
          google.accounts.id.renderButton(targetElement, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'continue_with',
            shape: 'rectangular'
          });
        }
      } catch (err) {
        console.warn('Google SDK init error:', err);
      }
    }
  }

  /**
   * Triggers Google Sign-In (with instant fallback for dev environment)
   */
  promptGoogleSignIn(): void {
    const isPlaceholderKey = !environment.googleClientId || environment.googleClientId.includes('YOUR_GOOGLE_CLIENT_ID');

    if (!isPlaceholderKey && typeof google !== 'undefined' && google.accounts?.id) {
      google.accounts.id.prompt((notification: any) => {
        // If Google One-Tap wasn't displayed due to domain / client_id in dev
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('Google One-Tap skipped or not displayed in dev mode. Simulating Google login.');
          this.googleDevLogin();
        }
      });
    } else {
      // In dev mode or before dán Google Client ID: Tự động chuyển sang Google Sign-In
      this.googleDevLogin();
    }
  }

  /**
   * Simulates Google Login when running in dev mode without Google Cloud Client ID
   */
  googleDevLogin(): void {
    const googleUser: User = {
      id: 'google-student-001',
      email: 'student.google@gmail.com',
      name: 'Alex (Google Student)',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GoogleStudent',
      provider: 'google'
    };

    this.currentUser.set(googleUser);
    localStorage.setItem(this.USER_KEY, JSON.stringify(googleUser));
    this.router.navigate(['/dashboard']);
  }

  /**
   * Decodes Google OAuth JWT ID Token and authenticates the user
   */
  handleGoogleCredentialResponse(response: any): void {
    if (response && response.credential) {
      const payload = this.decodeJwtPayload(response.credential);
      if (payload) {
        const googleUser: User = {
          id: payload.sub || 'google-' + Date.now(),
          email: payload.email,
          name: payload.name || payload.email.split('@')[0],
          avatarUrl: payload.picture,
          provider: 'google'
        };

        this.currentUser.set(googleUser);
        localStorage.setItem(this.USER_KEY, JSON.stringify(googleUser));
        this.router.navigate(['/dashboard']);
      }
    } else {
      this.googleDevLogin();
    }
  }

  emailLogin(email: string): void {
    const user: User = {
      id: 'user-' + Date.now(),
      email: email,
      name: email.split('@')[0],
      provider: 'email'
    };
    this.currentUser.set(user);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(this.USER_KEY);
    if (typeof google !== 'undefined' && google.accounts?.id) {
      google.accounts.id.disableAutoSelect();
    }
    this.router.navigate(['/']);
  }

  private decodeJwtPayload(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to decode Google JWT token', e);
      return null;
    }
  }

  private getStoredUser(): User | null {
    try {
      const data = localStorage.getItem(this.USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}
