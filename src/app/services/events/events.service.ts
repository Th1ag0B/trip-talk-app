import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { HttpHeaders } from '@angular/common/http';


export interface Event {
  id: string;
  name: string;
  description?: string;
  destiny: string;
  startDate: Date;
  endDate: Date;
  createdById: string;
  createdAt: Date;
  imageUrl?: string;
}

export interface Comment {
  id: string;
  userId: string;
  commentType: string;
  eventId: string;
  content: string;
  createdAt: string;
  user: {  
    id: string;
    name: string;
  };
}
export interface Favorite {
  userId: string;
  eventId: string;
}

export interface Pitstop {
  id?: string;
  eventId: string;
  location: string;
  description: string;
  plannedDate: Date;
  duration: number;
  createdAt?: Date;
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

  // Existing methods remain the same...
  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  createEvent(eventData: FormData): Observable<Event> {
    return this.authService.checkAuth().pipe(
      switchMap((authResponse) => {
        if (!authResponse.isAuthenticated || !authResponse.user?.id) {
          return throwError(() => new Error('User not authenticated'));
        }

        return this.http.post<Event>(`${this.apiUrl}/create`, eventData, {
          withCredentials: true,
        }).pipe(catchError(this.handleError));
      })
    );
  }
  editEvent(id: string, eventData: any): Observable<Event> {
    return this.authService.checkAuth().pipe(
      switchMap((authResponse) => {
        if (!authResponse.isAuthenticated || !authResponse.user?.id) {
          return throwError(() => new Error('User not authenticated'));
        }
  
        return this.http.put<Event>(`${this.apiUrl}/edit/${id}`, eventData, { withCredentials: true })
          .pipe(catchError(this.handleError));
      })
    );
  }

  deleteEvent(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/delete/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Enhanced comment methods
  getComments(eventId: string): Observable<Comment[]> {
    return this.http
      .get<Comment[]>(`${this.apiUrl}/${eventId}/comments`)
      .pipe(
        catchError(this.handleError)
      );
  }
  addComment(commentData: { text: string; eventId: string;commentType: string }): Observable<Comment> {
    return this.authService.checkAuth().pipe(
      switchMap((authResponse) => {
        if (!authResponse.isAuthenticated || !authResponse.user?.id) {
          return throwError(() => new Error('User not authenticated'));
        }
        const commentPayload = {
          text: commentData.text,
          userId: authResponse.user.id,
          userName: authResponse.user.name || 'Anonymous',
          commentType: "DESTINY"
        };
  
        return this.http
        .post<Comment>(`${this.apiUrl}/comments/${commentData.eventId}`, commentPayload, {
          withCredentials: true,
        })
        .pipe(catchError(this.handleError));
    })
    );
  }
  getEventDetails(eventId: string): Observable<Event> {
    return this.http
      .get<Event>(`${this.apiUrl}/${eventId}`)
      .pipe(catchError(this.handleError));
  }
  getEventById(eventId: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${eventId}`).pipe(catchError(this.handleError));
  }
  

  deleteComment(commentId: string): Observable<void> {
    return this.authService.checkAuth().pipe(
      switchMap((authResponse) => {
        if (!authResponse.isAuthenticated || !authResponse.user?.id) {
          return throwError(() => new Error('User not authenticated'));
        }

        return this.http
          .delete<void>(`${this.apiUrl}/comment/${commentId}`)
          .pipe(catchError(this.handleError));
      })
    );
  }

  // New pitstop methods
  getPitstops(eventId: string): Observable<Pitstop[]> {
    return this.http
      .get<Pitstop[]>(`${this.apiUrl}/${eventId}/pitstops`)
      .pipe(catchError(this.handleError));
  }

  addPitstop(eventId: string, pitstopData: Omit<Pitstop, 'id' | 'eventId' | 'createdAt'>): Observable<Pitstop> {
    return this.authService.checkAuth().pipe(
      switchMap((authResponse) => {
        if (!authResponse.isAuthenticated || !authResponse.user?.id) {
          return throwError(() => new Error('User not authenticated'));
        }

        const pitstopToAdd = {
          ...pitstopData,
          eventId,
          createdAt: new Date()
        };

        return this.http
          .post<Pitstop>(`${this.apiUrl}/${eventId}/pitstops`, pitstopToAdd)
          .pipe(catchError(this.handleError));
      })
    );
  }

  deletePitstop(eventId: string, pitstopId: string): Observable<void> {
    return this.authService.checkAuth().pipe(
      switchMap((authResponse) => {
        if (!authResponse.isAuthenticated || !authResponse.user?.id) {
          return throwError(() => new Error('User not authenticated'));
        }

        return this.http
          .delete<void>(`${this.apiUrl}/${eventId}/pitstops/${pitstopId}`)
          .pipe(catchError(this.handleError));
      })
    );
  }

  // Existing favorite methods remain the same...
  addFavorite(eventId: string): Observable<Favorite> {
    return this.authService.checkAuth().pipe(
      switchMap((authResponse) => {
        if (!authResponse.isAuthenticated || !authResponse.user?.id) {
          return throwError(() => new Error('User not authenticated'));
        }

        const favorite: Favorite = {
          userId: authResponse.user.id,
          eventId: eventId,
        };

        return this.http.post<Favorite>(`${this.apiUrl}/favorites/add`, favorite)
          .pipe(catchError(this.handleError));
      })
    );
  }

  removeFavorite(eventId: string): Observable<void> {
    return this.authService.checkAuth().pipe(
      switchMap((authResponse) => {
        if (!authResponse.isAuthenticated || !authResponse.user?.id) {
          return throwError(() => new Error('User not authenticated'));
        }

        const favorite: Favorite = {
          userId: authResponse.user.id,
          eventId: eventId,
        };

        return this.http.delete<void>(`${this.apiUrl}/favorites/remove`, {
          body: favorite,
        }).pipe(catchError(this.handleError));
      })
    );
  }

  getUserFavorites(userId: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/favorites/${userId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('EventService Error:', error);
    const message =
      error.error?.message || 'An unexpected error occurred. Please try again.';
    return throwError(() => new Error(message));
  }
}