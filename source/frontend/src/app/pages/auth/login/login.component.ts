import { Component, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { parseJwt } from '../../../shared/utils/jwt.util';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements AfterViewInit {
  isLoginMode = true;

  constructor(
    private authService: AuthService,
    private ngZone: NgZone,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.initGoogleAuth();
  }

  initGoogleAuth() {
    if (typeof google === 'undefined') {
      setTimeout(() => this.initGoogleAuth(), 100);
      return;
    }

    const container = document.getElementById('google-btn');
    if (!container) {
      // Nếu phần tử DOM chưa được render xong do route transition, thử lại sau 50ms
      setTimeout(() => this.initGoogleAuth(), 50);
      return;
    }

    // Xóa sạch nội dung cũ trong container trước khi vẽ nút mới để tránh lỗi render đè của Google SDK
    container.innerHTML = '';

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: this.handleGoogleCredentialResponse.bind(this)
    });

    google.accounts.id.renderButton(
      container,
      { theme: 'outline', size: 'large', text: 'continue_with', width: '380' }
    );
  }

  handleGoogleCredentialResponse(response: any) {
    this.ngZone.run(() => {
      this.authService.googleLogin(response.credential).subscribe({
        next: (res) => {
          console.log('Đăng nhập Google thành công!', res);
          const token = localStorage.getItem('accessToken');
          if (token) {
             const payload = parseJwt(token);
             if (payload?.role === 'ADMIN') {
               this.router.navigate(['/admin']);
             } else {
               this.router.navigate(['/dashboard']);
             }
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          console.error('Đăng nhập Google thất bại', err);
        }
      });
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
