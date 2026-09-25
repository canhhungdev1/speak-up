import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-waitlist-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="closeModal.emit()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <!-- Close Button -->
        <button type="button" class="close-btn" (click)="closeModal.emit()" title="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        @if (isSubmitted()) {
          <!-- Success State -->
          <div class="success-state">
            <div class="success-icon">🎉</div>
            <h3 class="modal-title">You're on the list!</h3>
            <p class="modal-subtitle">
              Thank you for joining SpeakUp early access. We will notify <strong>{{ email() }}</strong> as soon as the first Effortless English module goes live!
            </p>
            <button type="button" class="btn btn-primary" (click)="closeModal.emit()">
              Awesome!
            </button>
          </div>
        } @else {
          <!-- Form State -->
          <div class="form-header">
            <div class="modal-badge">EARLY ACCESS</div>
            <h3 class="modal-title">Start Learning Effortlessly</h3>
            <p class="modal-subtitle">
              Enter your email to get instant notification & exclusive early-bird access to SpeakUp.
            </p>
          </div>

          <form (ngSubmit)="onSubmit()" class="modal-form">
            <div class="form-group">
              <label for="fullName">Your Name</label>
              <input 
                type="text" 
                id="fullName" 
                name="fullName"
                [(ngModel)]="fullName" 
                placeholder="e.g. Alex Johnson"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="email">Email Address <span class="required">*</span></label>
              <input 
                type="email" 
                id="email" 
                name="email"
                [(ngModel)]="email" 
                required 
                placeholder="alex@example.com"
                class="form-input"
              />
            </div>

            <button type="submit" class="btn btn-primary btn-block" [disabled]="!email()">
              Get Early Access 🚀
            </button>
          </form>
        }
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(11, 15, 23, 0.75);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.25s ease;
    }

    .modal-card {
      background-color: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 24px;
      padding: 40px;
      width: 100%;
      max-width: 480px;
      position: relative;
      box-shadow: var(--shadow-lg);
      animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;

      &:hover {
        background-color: var(--bg-surface-hover);
        color: var(--text-main);
      }
    }

    .form-header {
      text-align: center;
      margin-bottom: 28px;
    }

    .modal-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--primary);
      background-color: var(--primary-light);
      padding: 4px 12px;
      border-radius: 9999px;
      margin-bottom: 12px;
    }

    .modal-title {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--text-main);
      margin-bottom: 8px;
    }

    .modal-subtitle {
      font-size: 0.95rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;

      label {
        font-size: 0.88rem;
        font-weight: 600;
        color: var(--text-main);

        .required {
          color: #EF4444;
        }
      }
    }

    .form-input {
      width: 100%;
      padding: 12px 16px;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      background-color: var(--bg-main);
      color: var(--text-main);
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;

      &:focus {
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
      }
    }

    .btn-block {
      width: 100%;
      padding: 14px;
      font-size: 1rem;
      margin-top: 8px;
    }

    .success-state {
      text-align: center;
      padding: 20px 0;

      .success-icon {
        font-size: 3.5rem;
        margin-bottom: 16px;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scaleUp {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class WaitlistModalComponent {
  closeModal = output<void>();

  fullName = signal<string>('');
  email = signal<string>('');
  isSubmitted = signal<boolean>(false);

  onSubmit(): void {
    if (this.email()) {
      this.isSubmitted.set(true);
    }
  }
}
