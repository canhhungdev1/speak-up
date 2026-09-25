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
    }
  }

  /**
   * Triggers the Google One-Tap or Prompt popup directly
   */
  promptGoogleSignIn(): void {
    if (typeof google !== 'undefined' && google.accounts?.id) {
      google.accounts.id.prompt();
    } else {
      // Fallback if Google SDK hasn't loaded or invalid Client ID in dev
      console.warn('Google SDK not ready or in dev mode. Falling back to Mock Login.');
      this.mockLogin();
    }
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
    }
  }

  mockLogin(): void {
    const mockUser: User = {
      id: 'dev-user-001',
      email: 'alex@speakup.app',
      name: 'Alex Johnson',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      provider: 'mock'
    };

    this.currentUser.set(mockUser);
    localStorage.setItem(this.USER_KEY, JSON.stringify(mockUser));
    this.router.navigate(['/dashboard']);
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
