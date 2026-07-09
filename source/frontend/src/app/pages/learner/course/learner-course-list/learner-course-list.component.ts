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
    this.courseService.fetchCourses();
    this.courseService.courses$.subscribe(courses => {
      this.courses = courses.filter(c => c.isPublished);
      this.isLoading = false;
    });
  }
}
