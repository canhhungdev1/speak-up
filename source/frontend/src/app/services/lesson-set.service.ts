import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LessonSet {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  orderIndex: number;
  requiredDays: number;
  lessons?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class LessonSetService {
  private apiUrl = `${environment.apiUrl}/lesson-sets`;

  constructor(private http: HttpClient) {}

  getLessonSetsByCourse(courseId: string): Observable<LessonSet[]> {
    return this.http.get<LessonSet[]>(`${this.apiUrl}?courseId=${courseId}`);
  }

  createLessonSet(data: any): Observable<LessonSet> {
    return this.http.post<LessonSet>(this.apiUrl, data);
  }

  updateLessonSet(id: string, data: any): Observable<LessonSet> {
    return this.http.patch<LessonSet>(`${this.apiUrl}/${id}`, data);
  }

  deleteLessonSet(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
