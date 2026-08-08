import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled">
      <div class="container navbar-container">
        <a routerLink="/" class="logo">
          Speak<span class="logo-up">Up</span>
        </a>
        
        <div class="nav-links">
          <a href="#method">The Method</a>
          <a href="#how-it-works">How It Works</a>
        </div>
        
        <div class="nav-actions">
          <button class="theme-toggle" (click)="toggleTheme()" aria-label="Toggle Theme">
            <!-- Moon Icon (Light Mode) -->
            <svg *ngIf="!isDarkMode" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </svg>
            <!-- Sun Icon (Dark Mode) -->
            <svg *ngIf="isDarkMode" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path><path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path><path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
          </button>
          
          <button class="btn-dashboard" routerLink="/login">Dashboard 🚀</button>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit {
  isDarkMode = false;
  isScrolled = false;

  ngOnInit() {
    this.checkTheme();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  checkTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark');
    } else {
      this.isDarkMode = false;
      document.body.classList.remove('dark');
    }
  }
}
