import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './course-list.html',
  styleUrl: './course-list.scss'
})
export class CourseList {
  // Mock data for UI development
  courses = [
    {
      id: 'test-course',
      title: 'Original Effortless English',
      level: 'Beginner',
      lessonSetsCount: 30,
      createdAt: new Date('2023-01-01')
    },
    {
      id: 'flow-english',
      title: 'Flow English',
      level: 'Intermediate',
      lessonSetsCount: 15,
      createdAt: new Date('2023-05-15')
    },
    {
      id: 'power-english',
      title: 'Power English',
      level: 'Advanced',
      lessonSetsCount: 40,
      createdAt: new Date('2023-08-20')
    }
  ];

  // Modal state
  isCreateModalOpen = false;
  
  newCourse = {
    title: '',
    level: 'Beginner',
    description: ''
  };

  openCreateModal() {
    this.isCreateModalOpen = true;
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
    this.newCourse = { title: '', level: 'Beginner', description: '' };
  }

  saveCourse() {
    if(!this.newCourse.title) {
      alert('Please enter course title');
      return;
    }
    
    this.courses.unshift({
      id: 'new-course-' + Date.now(),
      title: this.newCourse.title,
      level: this.newCourse.level,
      lessonSetsCount: 0,
      createdAt: new Date()
    });
    
    this.closeCreateModal();
    alert('Course created successfully!');
  }

  deleteCourse(course: any) {
    if(confirm('Are you sure you want to delete this course?')) {
      alert('Deleted ' + course.title);
    }
  }
}
