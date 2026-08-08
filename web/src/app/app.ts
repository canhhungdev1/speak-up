import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar.component';
import { HeroComponent } from './components/hero.component';
import { PillarsComponent } from './components/pillars.component';
import { HowItWorksComponent } from './components/how-it-works.component';
import { CtaComponent } from './components/cta.component';
import { FooterComponent } from './components/footer.component';

@Component({
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    HeroComponent,
    PillarsComponent,
    HowItWorksComponent,
    CtaComponent,
    FooterComponent
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  protected title = 'web';

  ngAfterViewInit() {
    this.setupScrollReveal();
  }

  private setupScrollReveal() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
      });

      const elements = document.querySelectorAll('.reveal-section');
      elements.forEach(el => observer.observe(el));
    }
  }
}
