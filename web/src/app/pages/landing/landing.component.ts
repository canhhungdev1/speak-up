import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar.component';
import { HeroComponent } from '../../components/hero.component';
import { PillarsComponent } from '../../components/pillars.component';
import { HowItWorksComponent } from '../../components/how-it-works.component';
import { CtaComponent } from '../../components/cta.component';
import { FooterComponent } from '../../components/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    PillarsComponent,
    HowItWorksComponent,
    CtaComponent,
    FooterComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <main>
      <div class="reveal-section">
        <app-hero></app-hero>
      </div>
      <div class="reveal-section">
        <app-pillars></app-pillars>
      </div>
      <div class="reveal-section">
        <app-how-it-works></app-how-it-works>
      </div>
      <div class="reveal-section">
        <app-cta></app-cta>
      </div>
    </main>
    <app-footer></app-footer>
  `,
  styles: []
})
export class LandingComponent implements AfterViewInit {
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
