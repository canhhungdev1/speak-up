import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private http = inject(HttpClient);
  private router = inject(Router);

  // Signals để UI có thể track state dễ dàng
  currentUser = signal<User | null>(null);
  isLoading = signal<boolean>(true);
  
  // Lưu token vào RAM (hoặc có thể dùng localStorage)
  private accessToken: string | null = null;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.setupAuthListener();
  }

  get token(): string | null {
    return this.accessToken;
  }

  private setupAuthListener() {
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Supabase Auth Event:', event);
      
      if (session) {
        this.currentUser.set(session.user);
        this.accessToken = session.access_token;
        localStorage.setItem('access_token', session.access_token);
        
        // Nếu user vừa đăng nhập thành công, gọi API đồng bộ xuống Backend
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          await this.syncUserWithBackend();
          
          // Tự động chuyển hướng vào Dashboard nếu đang bị kẹt ở trang đăng nhập
          if (this.router.url.includes('/auth')) {
            this.router.navigate(['/app/dashboard']);
          }
        }
      } else {
        this.currentUser.set(null);
        this.accessToken = null;
        localStorage.removeItem('access_token');
      }
      
      this.isLoading.set(false);
    });
  }

  async signInWithGoogle() {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/app/dashboard' // Chuyển về dashboard sau khi login
      }
    });

    if (error) {
      console.error('Lỗi đăng nhập Google:', error.message);
      throw error;
    }
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      console.error('Lỗi đăng xuất:', error.message);
      throw error;
    }
    
    // Xóa state
    this.currentUser.set(null);
    this.accessToken = null;
    
    // Trở về trang auth
    this.router.navigate(['/auth']);
  }

  private async syncUserWithBackend() {
    try {
      // Vì Interceptor sẽ tự động lấy token từ this.token, chúng ta chỉ cần gọi API
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/auth/sync`, {})
      );
      console.log('Đồng bộ user với backend thành công!');
    } catch (error) {
      console.error('Lỗi khi đồng bộ user với backend:', error);
    }
  }
}
