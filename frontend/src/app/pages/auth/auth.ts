import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  isLoginMode = true;

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
