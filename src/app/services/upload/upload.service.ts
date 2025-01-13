
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';  

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private apiUrl: string = `${environment.apiUrl}/upload/profile-picture`;  

  constructor(private http: HttpClient) {}


  uploadProfilePicture(file: File, token: string): Observable<any> {
    const formData = new FormData();
    formData.append('profilePicture', file, file.name);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  
    });

    return this.http.post<any>(this.apiUrl, formData, { headers });
  }
}
