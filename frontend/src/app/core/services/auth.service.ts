import { Injectable, inject, signal, NgZone } from '@angular/core';
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
  private ngZone = inject(NgZone);

  // Signals để UI có thể track state dễ dàng
  currentUser = signal<User | null>(null);
  userProfile = signal<any>(null);
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

  async getSession() {
    return await this.supabase.auth.getSession();
  }

  async waitForAuthReady(): Promise<void> {
    if (!this.isLoading()) return;
    
    return new Promise(resolve => {
      const check = setInterval(() => {
        if (!this.isLoading()) {
          clearInterval(check);
          resolve();
        }
      }, 50);
    });
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
          
          // Tự động chuyển hướng vào Dashboard nếu chưa ở trong app
          const currentUrl = this.router.url;
          if (!currentUrl.includes('/student/') && !currentUrl.includes('/admin/')) {
            const role = this.userProfile()?.role || 'STUDENT';
            this.ngZone.run(() => {
              if (role === 'ADMIN') {
                this.router.navigate(['/admin/dashboard']);
              } else {
                this.router.navigate(['/student/dashboard']);
              }
            });
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
        redirectTo: window.location.origin // Redirect về root để AuthState listener tự xử lý role
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
      const res: any = await firstValueFrom(
        this.http.post(`${environment.apiUrl}/auth/sync`, {})
      );
      this.userProfile.set(res.user);
      console.log('Đồng bộ user với backend thành công!', res.user);
    } catch (error) {
      console.error('Lỗi khi đồng bộ user với backend:', error);
    }
  }
}
