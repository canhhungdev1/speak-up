import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { parseJwt } from '../shared/utils/jwt.util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/v1/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = parseJwt(token);
        this.currentUserSubject.next(payload);
      } catch (e) {
        console.error('Invalid token');
        localStorage.removeItem('accessToken');
      }
    }
  }

  googleLogin(credential: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/google`, { token: credential }).pipe(
      tap((response: any) => {
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          const payload = parseJwt(response.accessToken);
          this.currentUserSubject.next(payload);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.currentUserSubject.next(null);
  }
}
