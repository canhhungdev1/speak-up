import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    section { padding: 80px 0 120px 0; }
    .cta-banner {
      background: var(--cta-bg);
      border-radius: 28px;
      padding: 96px 40px;
      text-align: center;
      color: white;
      box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.4);
      position: relative;
      overflow: hidden;
    }
    
    .badge-dark {
      display: inline-flex; padding: 6px 16px;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 99px; font-size: 11px; font-weight: 800;
      text-transform: uppercase; letter-spacing: 1px;
      margin-bottom: 24px; color: rgba(255,255,255,0.9);
    }
    
    h2 { font-size: 48px; margin-bottom: 20px; color: white; line-height: 1.1; letter-spacing: -0.02em; }
    p { font-size: 15px; color: rgba(255,255,255,0.8); max-width: 500px; margin: 0 auto 36px; line-height: 1.6; font-weight: 500; }
    
    .btn-light {
      background: white; color: #0f172a; padding: 16px 32px; font-weight: 700;
    }
    .btn-light:hover {
      background: #f8fafc;
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(255,255,255,0.2);
    }
  `],
  template: `
    <section>
      <div class="container">
        <div class="cta-banner">
          <div class="badge-dark">Get Started Today</div>
          <h2>Ready to Speak English<br>Effortlessly?</h2>
          <p>Join thousands of students who have achieved fluency through the Effortless English method. Learn with your ears, not your eyes.</p>
          <button class="btn btn-light">Go to Dashboard 🚀</button>
        </div>
      </div>
    </section>
  `
})
export class CtaComponent {}
