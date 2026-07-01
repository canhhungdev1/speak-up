import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-course-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-create.html',
  styleUrl: './course-create.scss'
})
export class CourseCreate {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  courseForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    level: ['Beginner', Validators.required],
    coverImageUrl: ['']
  });

  onSubmit() {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.http.post(`${environment.apiUrl}/courses`, this.courseForm.getRawValue()).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.successMessage = 'Course created successfully!';
        setTimeout(() => {
          this.router.navigate(['/admin/dashboard']);
        }, 1500);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Failed to create course. Please try again.';
        console.error('Create course error:', err);
      }
    });
  }
}
