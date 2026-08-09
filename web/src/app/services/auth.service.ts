import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider: string;
}

export interface AuthResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/v1/auth';
  
  // State management using Angular Signals
  public currentUser = signal<User | null>(this.getStoredUser());
  public isAuthenticated = signal<boolean>(!!this.getStoredToken());
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  async loginWithGoogle(idToken: string): Promise<boolean> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/google`, { idToken })
      );

      if (response.success && response.data) {
        const { accessToken, refreshToken, user } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        this.currentUser.set(user);
        this.isAuthenticated.set(true);
        this.isLoading.set(false);
        return true;
      }
      throw new Error(response.message || 'Đăng nhập thất bại');
    } catch (err: any) {
      this.isLoading.set(false);
      const msg = err.error?.message || err.message || 'Xác thực Google thất bại. Vui lòng thử lại.';
      this.errorMessage.set(Array.isArray(msg) ? msg.join(', ') : msg);
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getStoredUser(): User | null {
    const data = localStorage.getItem('user');
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
}
