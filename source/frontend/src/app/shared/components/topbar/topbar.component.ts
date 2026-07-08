import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit {
  userName = 'Student';
  userInitial = 'S';
  userAvatar = '';
  isDarkMode = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.extractUserInfo();
    this.themeService.isDarkTheme$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  extractUserInfo() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const payloadStr = token.split('.')[1];
          const payload = JSON.parse(atob(payloadStr));
          if (payload.name) {
            this.userName = payload.name;
            this.userInitial = this.userName.charAt(0).toUpperCase();
          }
          if (payload.avatarUrl) {
            this.userAvatar = payload.avatarUrl;
          }
        } catch (e) {
          console.error('Lỗi parse JWT', e);
        }
      }
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleSidebar() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.toggle('sidebar-open');
    }
  }
}
