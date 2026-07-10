import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

declare var google: any;

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  isAdmin = false;
  userName = '';
  userInitial = '';
  userAvatar = '';
  private userSub?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userSub = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isAdmin = user.role === 'ADMIN';
        this.userName = user.name || 'Student';
        this.userInitial = this.userName.charAt(0).toUpperCase();
        this.userAvatar = user.avatarUrl || '';
      } else {
        this.isAdmin = false;
        this.userName = '';
        this.userInitial = '';
        this.userAvatar = '';
      }
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
    
    // Ngắt tính năng tự động đăng nhập của Google (nếu có)
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
      google.accounts.id.disableAutoSelect();
    }

    // Đẩy về trang chủ
    this.router.navigate(['/']);
  }
}
