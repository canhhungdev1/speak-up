import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit {
  userName = 'Student';
  greeting = 'Good afternoon';
  timeClass = 'afternoon'; // 'morning', 'afternoon', 'evening'

  recommendedCourses = [
    { title: 'Original English', lessons: 30, tag: 'Intermediate', color: 'blue' },
    { title: 'Power English', lessons: 30, tag: 'Advanced', color: 'green' },
    { title: 'Real English', lessons: 30, tag: 'Advanced', color: 'orange' },
    { title: 'Pronunciation', lessons: 30, tag: 'Beginner', color: 'purple' }
  ];

  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  chartData = [80, 50, 90, 20, 0, 0, 0]; // Giả lập dữ liệu % chiều cao

  ngOnInit() {
    this.setGreeting();
    
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payloadStr = token.split('.')[1];
        const payload = JSON.parse(atob(payloadStr));
        if (payload.name) {
          this.userName = payload.name;
        }
      } catch(e) {}
    }
  }

  setGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      this.greeting = 'Good morning';
      this.timeClass = 'morning';
    } else if (hour >= 12 && hour < 18) {
      this.greeting = 'Good afternoon';
      this.timeClass = 'afternoon';
    } else {
      this.greeting = 'Good evening';
      this.timeClass = 'evening';
    }
  }
}
