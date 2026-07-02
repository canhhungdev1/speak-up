import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Auth } from './pages/auth/auth';
import { StudentLayout } from './layouts/student-layout/student-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Explore } from './pages/explore/explore';
import { CourseDetail } from './pages/course-detail/course-detail';
import { LessonPlayer } from './pages/lesson-player/lesson-player';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'auth', component: Auth },
  
  // Routes cho Học viên
  { 
    path: 'student', 
    component: StudentLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'explore', component: Explore },
      { path: 'course/:id', component: CourseDetail },
      { path: 'lesson/:id', component: LessonPlayer },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Routes cho Admin
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: 'dashboard', component: Dashboard }, // Tạm thời dùng chung Dashboard, có thể tách sau
      { 
        path: 'courses', 
        loadComponent: () => import('./pages/admin/courses/course-list/course-list').then(m => m.CourseList) 
      },
      { 
        path: 'courses/:id/curriculum', 
        loadComponent: () => import('./pages/admin/courses/course-curriculum/course-curriculum').then(m => m.CourseCurriculum) 
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
  // Fallback
  { path: '**', redirectTo: '' }
];
