import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}/user`; 

  constructor(private http: HttpClient) { }

  updateUser(userId: string, name: string, email: string, currentPassword: string, newPassword: string): Observable<any> {
    const updateData = {
      name,
      email,
      currentPassword,
      newPassword
    };

    return this.http.put(`${this.apiUrl}/update/${userId}`, updateData).pipe(
      catchError(this.handleError)
    );
  }


  uploadProfilePicture(userId: string, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.apiUrl}/profile-picture/${userId}`, formData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  
getUserDetails(userId: string): Observable<any> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);

  return this.http.get(`${this.apiUrl}/profile/${userId}`, { headers }).pipe(
    catchError(this.handleError)
  );
}


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
