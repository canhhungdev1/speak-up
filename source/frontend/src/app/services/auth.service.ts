import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/v1/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Decode or set user based on token if needed
      // this.currentUserSubject.next({ token });
    }
  }

  googleLogin(credential: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/google`, { token: credential }).pipe(
      tap((response: any) => {
        if (response.accessToken) {
          localStorage.setItem('access_token', response.accessToken);
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    this.currentUserSubject.next(null);
  }
}
