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
    loadComponent: () => import('./shared/components/layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/learner/dashboard/home/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent)
      },
      {
        path: 'courses',
        loadComponent: () => import('./pages/learner/course/learner-course-list/learner-course-list.component').then(m => m.LearnerCourseListComponent)
      },
      {
        path: 'courses/:id',
        loadComponent: () => import('./pages/learner/course/learner-course-detail/learner-course-detail.component').then(m => m.LearnerCourseDetailComponent)
      },
      {
        path: 'learn/:lessonId',
        loadComponent: () => import('./pages/learner/lesson/learner-lesson-detail/learner-lesson-detail.component').then(m => m.LearnerLessonDetailComponent)
      },
      {
        path: 'sets/:setId',
        loadComponent: () => import('./pages/learner/set/learner-set-detail/learner-set-detail.component').then(m => m.LearnerSetDetailComponent)
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./shared/components/layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/admin/home/admin-home/admin-home.component').then(m => m.AdminHomeComponent)
      },
      {
        path: 'courses',
        loadComponent: () => import('./pages/admin/course-management/course-list/course-list.component').then(m => m.CourseListComponent)
      },
      {
        path: 'courses/:id',
        loadComponent: () => import('./pages/admin/course-management/course-detail/course-detail.component').then(m => m.CourseDetailComponent)
      },
      {
        path: 'courses/:courseId/sets/:setId',
        loadComponent: () => import('./pages/admin/course-management/lesson-set-manager/lesson-set-manager.component').then(m => m.LessonSetManagerComponent),
        children: [
          { path: '', redirectTo: 'main', pathMatch: 'full' },
          {
            path: 'main',
            loadComponent: () => import('./pages/admin/course-management/lesson-set-manager/main-article-manager/main-article-manager.component').then(m => m.MainArticleManagerComponent)
          },
          {
            path: 'vocab',
            loadComponent: () => import('./pages/admin/course-management/lesson-set-manager/vocab-manager/vocab-manager.component').then(m => m.VocabManagerComponent)
          },
          {
            path: 'mini-stories',
            loadComponent: () => import('./pages/admin/course-management/lesson-set-manager/mini-story-manager/mini-story-manager.component').then(m => m.MiniStoryManagerComponent)
          },
          {
            path: 'pov',
            loadComponent: () => import('./pages/admin/course-management/lesson-set-manager/pov-manager/pov-manager.component').then(m => m.PovManagerComponent)
          }
        ]
      }
    ]
  }
];
