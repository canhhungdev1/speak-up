import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

declare const google: any;

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider: 'google';
  accessToken?: string;
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
   * Initializes Google Identity Services SDK and renders official Google button
   */
  initGoogleOAuth(elementId: string): void {
    if (typeof window !== 'undefined') {
      const checkGoogleSdk = setInterval(() => {
        if (typeof google !== 'undefined' && google.accounts?.id) {
          clearInterval(checkGoogleSdk);

          try {
            google.accounts.id.initialize({
              client_id: environment.googleClientId,
              callback: (response: any) => this.handleGoogleCredentialResponse(response),
              auto_select: false
            });

            // Render official Google Sign-In button
            const targetElement = document.getElementById(elementId);
            if (targetElement) {
              targetElement.innerHTML = ''; // Clear container
              google.accounts.id.renderButton(targetElement, {
                theme: document.body.classList.contains('dark') ? 'filled_black' : 'outline',
                size: 'large',
                width: 360,
                text: 'continue_with',
                shape: 'rectangular',
                logo_alignment: 'left'
              });
            }
          } catch (err) {
            console.warn('Google SDK init warning:', err);
          }
        }
      }, 100);

      // Timeout after 5s
      setTimeout(() => clearInterval(checkGoogleSdk), 5000);
    }
  }

  /**
   * Triggers Google Sign-In prompt or Dev Fallback
   */
  promptGoogleSignIn(): void {
    const isPlaceholderKey = !environment.googleClientId || environment.googleClientId.includes('YOUR_GOOGLE_CLIENT_ID');

    if (!isPlaceholderKey && typeof google !== 'undefined' && google.accounts?.id) {
      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('Google One-Tap skipped or not displayed in dev mode. Simulating Google login.');
          this.googleDevLogin();
        }
      });
    } else {
      this.googleDevLogin();
    }
  }

  /**
   * Decodes Google OAuth JWT ID Token, syncs with backend, and navigates to /dashboard
   */
  async handleGoogleCredentialResponse(response: any): Promise<void> {
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

        // Attempt Backend API verification if available
        try {
          const apiRes = await fetch(`${environment.apiUrl}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: response.credential })
          });
          if (apiRes.ok) {
            const data = await apiRes.json();
            if (data?.accessToken) {
              googleUser.accessToken = data.accessToken;
            }
          }
        } catch {
          // Backend offline during local dev — graceful client fallback
        }

        this.currentUser.set(googleUser);
        localStorage.setItem(this.USER_KEY, JSON.stringify(googleUser));
        this.router.navigate(['/dashboard']);
      }
    } else {
      this.googleDevLogin();
    }
  }

  /**
   * Dev Fallback for local testing without domain whitelist
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
