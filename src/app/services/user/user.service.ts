import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment'; // Adjust path if necessary

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}/user`; // Base URL for user-related API

  constructor(private http: HttpClient) { }

  /**
   * Update user information (name, email, password)
   * @param userId - ID of the user to be updated
   * @param name - New name for the user
   * @param email - New email for the user
   * @param currentPassword - Current password for verification
   * @param newPassword - New password to update
   * @returns Observable with the server response
   */
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

  /**
   * Upload a new profile picture
   * @param userId - ID of the user whose profile picture is being updated
   * @param formData - FormData containing the file to be uploaded
   * @returns Observable with the server response
   */
  uploadProfilePicture(userId: string, formData: FormData): Observable<any> {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    // Set up the headers with authorization
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Post the form data along with headers
    return this.http.post(`${this.apiUrl}/profile-picture/${userId}`, formData, { headers }).pipe(
      catchError(this.handleError)
    );
  }
// In user.service.ts
  
getUserDetails(userId: string): Observable<any> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);

  return this.http.get(`${this.apiUrl}/profile/${userId}`, { headers }).pipe(
    catchError(this.handleError)
  );
}

  /**
   * Helper method to handle errors during HTTP requests
   * @param error - Error response from the HTTP request
   * @returns Observable error message
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
