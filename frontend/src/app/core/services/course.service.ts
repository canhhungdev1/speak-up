import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Lesson {
  id?: string;
  lessonSetId?: string;
  type: string;
  title: string;
  orderIndex?: number;
}

export interface LessonSet {
  id?: string;
  courseId?: string;
  title: string;
  orderIndex?: number;
  lessons?: Lesson[];
  isExpanded?: boolean; // Cho UI state
}

export interface Course {
  id?: string;
  title: string;
  description?: string;
  level: string;
  coverImageUrl?: string;
  createdAt?: string;
  lessonSetsCount?: number;
  lessonSets?: LessonSet[];
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/courses`;

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }

  createLessonSet(courseId: string, data: { title: string; orderIndex: number }): Observable<LessonSet> {
    return this.http.post<LessonSet>(`${this.apiUrl}/${courseId}/lesson-sets`, data);
  }

  createLesson(lessonSetId: string, data: { title: string; type: string; orderIndex: number }): Observable<Lesson> {
    return this.http.post<Lesson>(`${this.apiUrl}/lesson-sets/${lessonSetId}/lessons`, data);
  }

  reorderLessonSets(courseId: string, updates: { id: string; orderIndex: number }[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/${courseId}/lesson-sets/reorder`, updates);
  }

  reorderLessons(lessonSetId: string, updates: { id: string; orderIndex: number }[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/lesson-sets/${lessonSetId}/lessons/reorder`, updates);
  }
}
