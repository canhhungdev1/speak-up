import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    footer {
      padding: 60px 0 40px 0;
      text-align: center;
      border-top: 1px solid var(--border-color);
    }
    .footer-logo {
      font-weight: 800;
      font-size: 22px;
      letter-spacing: -0.03em;
      color: var(--text-primary);
      text-decoration: none;
      display: inline-block;
      margin-bottom: 12px;
    }
    .logo-up {
      color: var(--primary-color);
    }
    .slogan {
      font-size: 13px;
      color: var(--text-secondary);
      margin-bottom: 16px;
      font-weight: 500;
    }
    .copyright {
      font-size: 12px;
      color: var(--text-muted);
    }
  `],
  template: `
    <footer>
      <div class="container">
        <a href="/" class="footer-logo">
          Speak<span class="logo-up">Up</span>
        </a>
        <div class="slogan">Stop Studying Grammar. Start Speaking English.</div>
        <div class="copyright">&copy; 2026 SpeakUp. All rights reserved. Built with the Effortless English method in mind.</div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
