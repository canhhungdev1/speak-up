import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService, Course } from '../../../../core/services/course.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './course-list.html',
  styleUrl: './course-list.scss'
})
export class CourseList implements OnInit {
  private courseService = inject(CourseService);
  private cdr = inject(ChangeDetectorRef);

  courses: Course[] = [];
  
  // Modal state
  isCreateModalOpen = false;
  isSaving = false;
  
  newCourse = {
    title: '',
    level: 'Beginner',
    description: ''
  };

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    console.log('Đang gọi API GET /courses...');
    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        console.log('Dữ liệu courses nhận được:', data);
        this.courses = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load courses', err);
        alert('Failed to load courses from backend.');
      }
    });
  }

  openCreateModal() {
    this.isCreateModalOpen = true;
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
    this.newCourse = { title: '', level: 'Beginner', description: '' };
    this.isSaving = false;
  }

  saveCourse() {
    if(!this.newCourse.title) {
      alert('Please enter course title');
      return;
    }
    
    this.isSaving = true;
    this.courseService.createCourse({
      title: this.newCourse.title,
      level: this.newCourse.level,
      description: this.newCourse.description
    }).subscribe({
      next: (createdCourse) => {
        this.courses.unshift(createdCourse);
        this.closeCreateModal();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to create course', err);
        alert('Failed to create course. Please try again.');
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteCourse(course: any) {
    if(confirm('Are you sure you want to delete this course?')) {
      alert('Deleted ' + course.title);
      // Implement delete API later
    }
  }
}
