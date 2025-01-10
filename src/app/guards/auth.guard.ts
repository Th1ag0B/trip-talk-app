import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service'; // Adjust the path as needed
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.checkAuth().pipe(
      map((authResponse) => {
        if (authResponse.isAuthenticated) {
          return true; // Allow navigation
        } else {
          this.router.navigate(['/login']); // Redirect to login if not authenticated
          return false; // Block navigation
        }
      })
    );
  }
}
