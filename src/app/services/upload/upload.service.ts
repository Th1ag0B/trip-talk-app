// src/app/services/upload.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';  // Assuming you're storing API URL in environment

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private apiUrl: string = `${environment.apiUrl}/upload/profile-picture`;  // Backend API URL for uploading profile picture

  constructor(private http: HttpClient) {}

  // Method to upload a profile picture
  uploadProfilePicture(file: File, token: string): Observable<any> {
    const formData = new FormData();
    formData.append('profilePicture', file, file.name);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // Attach token if needed
    });

    return this.http.post<any>(this.apiUrl, formData, { headers });
  }
}
