import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ModalController } from '@ionic/angular'; 
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs'; 
import { catchError } from 'rxjs/operators'; 

interface AuthResponse {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    profilePictureUrl?: string;
  } | null;
  token?: string; 
}


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  checkAuth(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.baseUrl}/check`, { withCredentials: true }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Auth check error:', error);
        return of({ isAuthenticated: false, user: null });
      })
    );
  }

  
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