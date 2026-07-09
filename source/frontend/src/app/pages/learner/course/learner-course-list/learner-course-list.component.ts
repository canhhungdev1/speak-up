import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService, Course } from '../../../../services/course.service';

@Component({
  selector: 'app-learner-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './learner-course-list.component.html',
  styleUrls: ['./learner-course-list.component.scss']
})
export class LearnerCourseListComponent implements OnInit {
  courses: Course[] = [];
  isLoading = true;

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    // MOCK DATA for preview
    this.courses = [
      {
        id: 'mock-1',
        title: 'Original Effortless English',
        description: 'Khóa học nền tảng giúp bạn nghe nói tự nhiên, không cần học ngữ pháp truyền thống.',
        coverImageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600',
        isPublished: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'mock-2',
        title: 'Power English Now',
        description: 'Nâng cao năng lượng, động lực và sự tự tin khi nói tiếng Anh (Dành cho trình độ Trung cấp).',
        coverImageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600',
        isPublished: true,
        createdAt: new Date().toISOString()
      }
    ];
    this.isLoading = false;

    // TODO: Uncomment when API is ready
    /*
    this.courseService.fetchCourses();
    this.courseService.courses$.subscribe(courses => {
      this.courses = courses.filter(c => c.isPublished);
      this.isLoading = false;
    });
    */
  }
}
