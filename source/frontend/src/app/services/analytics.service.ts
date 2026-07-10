import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardStats {
  kpis: {
    totalLearners: number;
    activeLearners24h: number;
    totalCourses: number;
    totalStudyTimeMinutes: number;
  };
  recentSignups: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
    createdAt: string;
  }[];
  popularCourses: {
    id: string;
    title: string;
    coverImageUrl?: string;
    isPublished: boolean;
    lessonSetsCount: number;
    learnersCount: number;
  }[];
  learningActivity: number[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`);
  }
}
