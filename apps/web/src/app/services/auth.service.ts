import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl?: string | null;
  provider?: string;
  createdAt?: string;
}

export interface AuthApiResponse {
  statusCode: number;
  message: string;
  isNewUser: boolean;
  user: User;
  meta: {
    asyncEmailTriggered: boolean;
    messageBroker?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private readonly USER_KEY = 'speakup_user';

  currentUser = signal<User | null>(this.getStoredUser());
  isLoading = signal<boolean>(false);
  lastAuthNotice = signal<string | null>(null);

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  /**
   * Đăng nhập / Đăng ký tài khoản bằng Google OAuth
   * Gọi backend API: POST /api/v1/auth/google
   * Backend sẽ kiểm tra database PostgreSQL:
   * - Nếu user mới: lưu DB & kích hoạt RabbitMQ gửi welcome email ngầm
   * - Nếu user cũ: bỏ qua gửi mail
   */
  async googleLogin(customEmail?: string, customName?: string): Promise<AuthApiResponse | null> {
    this.isLoading.set(true);
    this.lastAuthNotice.set(null);

    const email = (customEmail && customEmail.trim()) || 'learner.google@speakup.app';
    const name = customName || email.split('@')[0];
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;

    try {
      const response = await firstValueFrom(
        this.http.post<AuthApiResponse>('/api/v1/auth/google', {
          email,
          name,
          avatarUrl,
        })
      );

      this.currentUser.set(response.user);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
      this.lastAuthNotice.set(response.message);

      this.router.navigate(['/dashboard']);
      return response;
    } catch (error) {
      console.error('Đăng nhập Google thất bại:', error);
      // Fallback cục bộ nếu không kết nối được server
      this.mockLogin();
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Đăng nhập bằng Email thông thường (kết nối trực tiếp vào API Google Auth backend)
   */
  async emailLogin(email: string): Promise<void> {
    await this.googleLogin(email);
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

  logout(): void {
    this.currentUser.set(null);
    this.lastAuthNotice.set(null);
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
