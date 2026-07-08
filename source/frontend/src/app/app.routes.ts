import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { 
    path: 'auth', 
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) 
  }
]; // Trigger rebuild
