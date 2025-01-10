import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs'; // Add 'of' import
import { catchError } from 'rxjs/operators'; // Add catchError import

interface AuthResponse {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    profilePictureUrl?: string;
  } | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  // Check authentication status
  checkAuth(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.baseUrl}/check`, {
      withCredentials: true,
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Auth check error:', error);
        return of({ isAuthenticated: false, user: null });
      })
    );
  }
  

  // Login method
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, 
      { email, password },
      { withCredentials: true }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  // Register method
  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, 
      { name, email, password },
      { withCredentials: true }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Registration error:', error);
        throw error;
      })
    );
  }

  // Logout method
  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Logout error:', error);
        throw error;
      })
    );
    
  }
  
}