import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Event {
  id: string;
  name: string;
  description?: string;
  destiny: string;
  startDate: Date;
  endDate: Date;
  createdById: string;
  shareLink: string;
  createdAt: Date;
}
export interface Comment {
  eventId: string;
  userId: string;
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly apiUrl = `${environment.apiUrl}/events`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Get all events
   */
  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  /**
   * Create a new event
   */
  createEvent(eventData: Partial<Event>): Observable<Event> {
    return this.authService.checkAuth().pipe(
      switchMap((authResponse) => {
        if (!authResponse.isAuthenticated || !authResponse.user?.id) {
          return throwError(() => new Error('User not authenticated'));
        }

        const eventToCreate = {
          ...eventData,
          createdById: authResponse.user.id
        };

        console.log('Sending event data:', eventToCreate);

        return this.http.post<Event>(`${this.apiUrl}/create`, eventToCreate, { withCredentials: true })
          .pipe(catchError(this.handleError));
      })
    );
  }

  /**
   * Edit an existing event by ID
   */
  editEvent(id: string, eventData: Partial<Event>): Observable<Event> {
    return this.http
      .put<Event>(`${this.apiUrl}/edit/${id}`, eventData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete an event by ID
   */
  deleteEvent(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/delete/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Add a comment to an event
   */
  addComment(commentData: Comment): Observable<Comment> {
    return this.authService.checkAuth().pipe(
      switchMap((authResponse) => {
        if (!authResponse.isAuthenticated || !authResponse.user?.id) {
          return throwError(() => new Error('User not authenticated'));
        }

        const commentToAdd = { 
          ...commentData, 
          userId: authResponse.user.id  // Add user ID to comment
        };

        return this.http.post<Comment>(`${this.apiUrl}/comment`, commentToAdd)
          .pipe(catchError(this.handleError));
      })
    );
  }

  /**
   * Global error handler for HTTP requests
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('EventService Error:', error);
    const message =
      error.error?.message || 'An unexpected error occurred. Please try again.';
    return throwError(() => new Error(message));
  }
}
