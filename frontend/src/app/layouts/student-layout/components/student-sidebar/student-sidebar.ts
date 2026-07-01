import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-student-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './student-sidebar.html',
  styleUrl: './student-sidebar.scss'
})
export class StudentSidebar {
  authService = inject(AuthService);
  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
