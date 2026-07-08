import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Lesson {
  id: string;
  lessonSetId: string;
  title: string;
  type: 'MAIN' | 'VOCAB' | 'MINI_STORY' | 'POV';
  audioUrl: string;
  durationSeconds?: number;
  orderIndex?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = `${environment.apiUrl}/lessons`;

  constructor(private http: HttpClient) {}

  getLessonsBySet(lessonSetId: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}?lessonSetId=${lessonSetId}`);
  }

  createLesson(data: any): Observable<Lesson> {
    return this.http.post<Lesson>(this.apiUrl, data);
  }

  updateLesson(id: string, data: any): Observable<Lesson> {
    return this.http.patch<Lesson>(`${this.apiUrl}/${id}`, data);
  }

  deleteLesson(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
