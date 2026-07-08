import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

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
  private apiUrl = `${environment.apiUrl}/courses`;

  private coursesSubject = new BehaviorSubject<Course[]>([]);
  public courses$ = this.coursesSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchCourses(): Observable<Course[]> {
    const request = this.http.get<Course[]>(this.apiUrl);
    request.subscribe({
      next: (courses) => this.coursesSubject.next(courses),
      error: (err) => console.error('Lỗi khi tải danh sách khóa học', err)
    });
    return request;
  }

  createCourse(courseData: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, courseData);
  }

  updateCourse(id: string, courseData: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, courseData);
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
