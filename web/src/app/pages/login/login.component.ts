import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, AfterViewInit {
  private readonly googleClientId = '334154088956-iv10ov32isau8o2c0mbt85qt3cf6dgkm.apps.googleusercontent.com';

  constructor(
    public authService: AuthService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initGoogleSDK();
  }

  private initGoogleSDK(): void {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: this.googleClientId,
        callback: (response: any) => this.handleGoogleCredentialResponse(response),
      });

      const btnContainer = document.getElementById('googleBtnContainer');
      if (btnContainer) {
        google.accounts.id.renderButton(btnContainer, {
          theme: 'filled_blue',
          size: 'large',
          text: 'signin_with',
          shape: 'pill',
          width: 280,
        });
      }
    } else {
      setTimeout(() => this.initGoogleSDK(), 300);
    }
  }

  private handleGoogleCredentialResponse(response: any): void {
    if (response && response.credential) {
      this.ngZone.run(async () => {
        await this.authService.loginWithGoogle(response.credential);
      });
    }
  }

  onLogout(): void {
    this.authService.logout();
    setTimeout(() => this.initGoogleSDK(), 100);
  }
}
