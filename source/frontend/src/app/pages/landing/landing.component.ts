import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  isDarkMode = false;
  isLoggedIn = false;
  userInitial = '';
  userAvatar = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkTheme$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        this.isLoggedIn = true;
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.name) {
            this.userInitial = payload.name.charAt(0).toUpperCase();
          }
          if (payload.avatarUrl) {
            this.userAvatar = payload.avatarUrl;
          }
        } catch (e) {}
      }
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
