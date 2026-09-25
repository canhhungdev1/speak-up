import { Component, signal } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { HeroComponent } from '../hero/hero.component';
import { PillarsComponent } from '../pillars/pillars.component';
import { HowItWorksComponent } from '../how-it-works/how-it-works.component';
import { CtaBannerComponent } from '../cta-banner/cta-banner.component';
import { FooterComponent } from '../footer/footer.component';
import { WaitlistModalComponent } from '../waitlist-modal/waitlist-modal.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    PillarsComponent,
    HowItWorksComponent,
    CtaBannerComponent,
    FooterComponent,
    WaitlistModalComponent
  ],
  template: `
    <!-- Sticky Header -->
    <app-header (openModal)="showModal.set(true)"></app-header>

    <!-- Main Landing Sections -->
    <main>
      <app-hero (openModal)="showModal.set(true)"></app-hero>
      <div class="section-divider"></div>
      <app-pillars></app-pillars>
      <div class="section-divider"></div>
      <app-how-it-works></app-how-it-works>
      <div class="section-divider"></div>
      <app-cta-banner (openModal)="showModal.set(true)"></app-cta-banner>
    </main>

    <!-- Footer -->
    <app-footer></app-footer>

    <!-- Waitlist / Early Access Modal -->
    @if (showModal()) {
      <app-waitlist-modal (closeModal)="showModal.set(false)"></app-waitlist-modal>
    }
  `
})
export class LandingComponent {
  showModal = signal<boolean>(false);
}
