import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="header">
      <div class="container header-container">
        <!-- Brand Logo -->
        <a routerLink="/" class="logo">
          <span class="logo-text">Speak<span class="logo-accent">Up</span></span>
        </a>

        <!-- Navigation Links -->
        <nav class="nav-links">
          <a href="#method">The Method</a>
          <a href="#how-it-works">How It Works</a>
        </nav>

        <!-- Actions: Theme Switcher & Action CTA -->
        <div class="header-actions">
          <!-- Dark / Light Theme Toggle Button -->
          <button 
            type="button" 
            class="btn-icon theme-toggle" 
            (click)="themeService.toggleTheme()"
            [attr.aria-label]="themeService.currentTheme() === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            [title]="themeService.currentTheme() === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
            <!-- Sun Icon for Dark Mode -->
            @if (themeService.currentTheme() === 'dark') {
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </svg>
            } @else {
              <!-- Moon Icon for Light Mode -->
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </svg>
            }
          </button>

          <!-- Primary CTA Button -->
          <a routerLink="/login" class="btn btn-primary">
            Start Learning 🚀
          </a>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: sticky;
      top: 0;
      z-index: 100;
      width: 100%;
      height: 80px;
      background-color: rgba(248, 250, 252, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }

    :host-context([data-theme="dark"]) .header,
    :host-context(body.dark) .header {
      background-color: rgba(11, 15, 23, 0.85);
    }

    .header-container {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      text-decoration: none;
      font-size: 1.6rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--text-main);
      display: flex;
      align-items: center;
    }

    .logo-accent {
      color: var(--primary);
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 32px;

      a {
        text-decoration: none;
        color: var(--text-secondary);
        font-weight: 500;
        font-size: 0.95rem;
        transition: color 0.2s ease;

        &:hover {
          color: var(--primary);
        }
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .theme-toggle {
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

      &:hover {
        transform: rotate(15deg) scale(1.08);
      }
    }

    @media (max-width: 640px) {
      .nav-links {
        display: none; /* Mobile menu can be toggled */
      }
    }
  `]
})
export class HeaderComponent {
  themeService = inject(ThemeService);
}
