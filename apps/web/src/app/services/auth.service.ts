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
   * Initializes Google Identity Services SDK and renders official Google button container
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

            const targetElement = document.getElementById(elementId);
            if (targetElement) {
              targetElement.innerHTML = '';
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

      setTimeout(() => clearInterval(checkGoogleSdk), 5000);
    }
  }

  /**
   * Triggers real Google OAuth 2.0 Account Chooser Popup Window (accounts.google.com)
   */
  promptGoogleSignIn(): void {
    if (typeof google !== 'undefined' && google.accounts?.oauth2) {
      try {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: environment.googleClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse && tokenResponse.access_token) {
              await this.fetchAndLoginGoogleProfile(tokenResponse.access_token);
            }
          }
        });
        client.requestAccessToken();
        return;
      } catch (e) {
        console.warn('initTokenClient failed, falling back to OAuth redirect:', e);
      }
    }

    // Direct Google OAuth 2.0 popup/redirect fallback
    const redirectUri = window.location.origin + '/login';
    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(environment.googleClientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=token` +
      `&scope=${encodeURIComponent('email profile openid')}`;

    // Open Google Login popup window
    const popup = window.open(googleOAuthUrl, 'GoogleSignInPopup', 'width=500,height=600');
    if (!popup) {
      window.location.href = googleOAuthUrl;
    }
  }

  /**
   * Fetches real user profile (email, name, picture) using Google OAuth Access Token
   */
  private async fetchAndLoginGoogleProfile(accessToken: string): Promise<void> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (response.ok) {
        const profile = await response.json();
        const googleUser: User = {
          id: profile.sub || 'google-' + Date.now(),
          email: profile.email,
          name: profile.name || profile.given_name || profile.email.split('@')[0],
          avatarUrl: profile.picture,
          provider: 'google',
          accessToken: accessToken
        };

        this.currentUser.set(googleUser);
        localStorage.setItem(this.USER_KEY, JSON.stringify(googleUser));
        this.router.navigate(['/dashboard']);
      }
    } catch (e) {
      console.error('Failed to fetch Google UserInfo', e);
    }
  }

  /**
   * Decodes Google OAuth JWT ID Token returned by Google Client SDK
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
