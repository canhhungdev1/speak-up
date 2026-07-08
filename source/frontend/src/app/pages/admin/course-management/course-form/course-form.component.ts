import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService, Course } from '../../../../services/course.service';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {
  @Input() course: Course | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  formData: Partial<Course> = {
    title: '',
    description: '',
    coverImageUrl: '',
    isPublished: false
  };

  isSaving = false;

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    if (this.course) {
      this.formData = {
        title: this.course.title,
        description: this.course.description,
        coverImageUrl: this.course.coverImageUrl,
        isPublished: this.course.isPublished
      };
    }
  }

  save() {
    if (!this.formData.title?.trim()) {
      alert('Vui lòng nhập tên khóa học!');
      return;
    }

    this.isSaving = true;
    if (this.course) {
      // Cập nhật
      this.courseService.updateCourse(this.course.id, this.formData).subscribe({
        next: () => {
          this.isSaving = false;
          this.saved.emit();
        },
        error: (err) => {
          console.error(err);
          this.isSaving = false;
          alert('Lỗi khi cập nhật khóa học');
        }
      });
    } else {
      // Tạo mới
      this.courseService.createCourse(this.formData).subscribe({
        next: () => {
          this.isSaving = false;
          this.saved.emit();
        },
        error: (err) => {
          console.error(err);
          this.isSaving = false;
          alert('Lỗi khi tạo khóa học');
        }
      });
    }
  }
}
