import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Auth } from './pages/auth/auth';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Explore } from './pages/explore/explore';
import { CourseDetail } from './pages/course-detail/course-detail';
import { LessonPlayer } from './pages/lesson-player/lesson-player';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'auth', component: Auth },
  { 
    path: 'app', 
    component: MainLayout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'explore', component: Explore },
      { path: 'course/:id', component: CourseDetail },
      { path: 'lesson/:id', component: LessonPlayer },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
