import { Component, OnInit, inject, computed } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss'
})
export class Topbar implements OnInit {
  private authService = inject(AuthService);
  
  user = this.authService.currentUser;
  userName = computed(() => this.user()?.user_metadata?.['full_name'] || this.user()?.email?.split('@')[0] || 'Student');
  avatarUrl = computed(() => this.user()?.user_metadata?.['avatar_url'] || null);

  streakDays = 5;
  isDarkMode = false;

  ngOnInit() {
    // Kiểm tra theme đã lưu trong localStorage hoặc theo hệ thống
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.isDarkMode = true;
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }
}
