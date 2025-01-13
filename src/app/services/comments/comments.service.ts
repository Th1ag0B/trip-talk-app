import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface UserComment  {
  id: string;
  userId: string;
  commentType: string;
  eventId?: string;
  comment: string;
  createdAt: string;
  event?: {
    id: string;
    name: string;
    description?: string;
    destiny: string;
    startDate: string;
    endDate: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private baseUrl = `${environment.apiUrl}/comments`;

  constructor(private http: HttpClient) {}


  getUserComments(userId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/${userId}/all`, { withCredentials: true }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching comments:', error);
        return of([]); 
      })
    );
  }
}
