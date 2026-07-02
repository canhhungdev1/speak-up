import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  authService = inject(AuthService);
  
  // Lấy tên từ Supabase session metadata hoặc User profile
  userName = computed(() => {
    const user = this.authService.currentUser();
    return user?.user_metadata?.['full_name'] || user?.email?.split('@')[0] || 'Student';
  });

  // Lấy lời chào dựa theo thời gian thực
  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  // Xác định buổi để đổi hình nền
  get timeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }
  
  // Dummy data for Weekly Chart
  weeklyData = [
    { day: 'Mon', minutes: 45, target: 30 },
    { day: 'Tue', minutes: 30, target: 30 },
    { day: 'Wed', minutes: 60, target: 30 },
    { day: 'Thu', minutes: 15, target: 30 },
    { day: 'Fri', minutes: 0, target: 30 },
    { day: 'Sat', minutes: 0, target: 30 },
    { day: 'Sun', minutes: 0, target: 30 },
  ];

  // Dummy data for Recommended Courses
  recommendedCourses = [
    { id: 1, title: 'Original English', level: 'Intermediate', color: '#3b82f6' },
    { id: 2, title: 'Power English', level: 'Advanced', color: '#10b981' },
    { id: 3, title: 'Real English', level: 'Advanced', color: '#f59e0b' },
    { id: 4, title: 'Pronunciation', level: 'Beginner', color: '#8b5cf6' },
  ];
}
