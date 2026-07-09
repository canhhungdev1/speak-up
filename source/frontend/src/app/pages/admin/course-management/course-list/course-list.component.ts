import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CourseService, Course } from '../../../../services/course.service';
import { CourseFormComponent } from '../course-form/course-form.component';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CourseFormComponent, DragDropModule],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  showForm = false;
  editingCourse: Course | null = null;
  isLoading = true;

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.loadCourses();
    this.courseService.courses$.subscribe(courses => {
      this.courses = courses;
      this.isLoading = false;
    });
  }

  loadCourses() {
    this.isLoading = true;
    this.courseService.fetchCourses();
  }

  drop(event: CdkDragDrop<Course[]>) {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.courses, event.previousIndex, event.currentIndex);
      const orderedIds = this.courses.map(c => c.id);
      this.courseService.reorderCourses(orderedIds).subscribe({
        next: () => console.log('Đã cập nhật thứ tự khóa học'),
        error: (err) => console.error('Lỗi khi cập nhật thứ tự', err)
      });
    }
  }

  openCreateForm() {
    this.editingCourse = null;
    this.showForm = true;
  }

  openEditForm(course: Course) {
    this.editingCourse = course;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingCourse = null;
  }

  onFormSaved() {
    this.closeForm();
    this.loadCourses();
  }

  togglePublish(course: Course) {
    this.courseService.updateCourse(course.id, { isPublished: !course.isPublished }).subscribe(() => {
      this.loadCourses();
    });
  }

  deleteCourse(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa khóa học này? Mọi dữ liệu bài học bên trong sẽ bị xóa sạch!')) {
      this.courseService.deleteCourse(id).subscribe(() => {
        this.loadCourses();
      });
    }
  }
}
