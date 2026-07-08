import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Course {
  id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  isPublished: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/api/v1/courses';
  private token: string | null = null;

  private coursesSubject = new BehaviorSubject<Course[]>([]);
  public courses$ = this.coursesSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('accessToken');
    }
  }

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  }

  fetchCourses(): Observable<Course[]> {
    const request = this.http.get<Course[]>(this.apiUrl);
    request.subscribe({
      next: (courses) => this.coursesSubject.next(courses),
      error: (err) => console.error('Lỗi khi tải danh sách khóa học', err)
    });
    return request;
  }

  createCourse(courseData: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, courseData, { headers: this.getHeaders() });
  }

  updateCourse(id: string, courseData: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, courseData, { headers: this.getHeaders() });
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
