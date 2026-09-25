import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="container footer-container">
        <!-- Logo -->
        <a href="#" class="logo">
          <span class="logo-text">Speak<span class="logo-accent">Up</span></span>
        </a>

        <p class="tagline">Stop Studying Grammar. Start Speaking English.</p>

        <p class="copyright">
          © {{ currentYear }} SpeakUp. All rights reserved. Built with the Effortless English method in mind.
        </p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      padding: 48px 0 64px 0;
      background-color: var(--bg-main);
      border-top: 1px solid var(--border-color);
      text-align: center;
    }

    .footer-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .logo {
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-main);
      letter-spacing: -0.03em;
    }

    .logo-accent {
      color: var(--primary);
    }

    .tagline {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .copyright {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 12px;
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
