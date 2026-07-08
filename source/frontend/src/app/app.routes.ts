import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/learner/landing/landing.component').then(m => m.LandingComponent) },
  { 
    path: 'auth', 
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) 
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/learner/dashboard/layout/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/learner/dashboard/home/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent)
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/admin/layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/admin/home/admin-home/admin-home.component').then(m => m.AdminHomeComponent)
      },
      {
        path: 'courses',
        loadComponent: () => import('./pages/admin/course-management/course-list/course-list.component').then(m => m.CourseListComponent)
      }
    ]
  }
];
