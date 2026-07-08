import { Component, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

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

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: this.handleGoogleCredentialResponse.bind(this)
    });

    google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      { theme: 'outline', size: 'large', text: 'continue_with', width: '380' }
    );
  }

  handleGoogleCredentialResponse(response: any) {
    this.ngZone.run(() => {
      this.authService.googleLogin(response.credential).subscribe({
        next: (res) => {
          console.log('Đăng nhập Google thành công!', res);
          // Chuyển hướng sang trang Dashboard
          this.router.navigate(['/dashboard']);
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
