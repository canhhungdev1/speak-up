import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
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

  mockLogin(): void {
    const mockUser: User = {
      id: 'dev-user-001',
      email: 'alex@speakup.app',
      name: 'Alex Johnson',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
    };

    this.currentUser.set(mockUser);
    localStorage.setItem(this.USER_KEY, JSON.stringify(mockUser));
    this.router.navigate(['/dashboard']);
  }

  googleLogin(): void {
    // For now, simulate Google OAuth success
    this.mockLogin();
  }

  emailLogin(email: string): void {
    const user: User = {
      id: 'user-' + Date.now(),
      email: email,
      name: email.split('@')[0]
    };
    this.currentUser.set(user);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/']);
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
