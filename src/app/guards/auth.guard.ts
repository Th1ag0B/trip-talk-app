import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      console.log('AuthGuard: Checking authentication...');
      const authResponse = await firstValueFrom(this.authService.checkAuth());
      console.log('AuthGuard: Auth Response:', authResponse);

      // Check if the user is authenticated
      if (authResponse?.isAuthenticated) {
        console.log('AuthGuard: User is authenticated.');
        return true;  // Allow access to the route
      } else {
        // Handle case where user is not authenticated
        console.log('AuthGuard: User is not authenticated. Redirecting to login.');
        this.router.navigate(['/login']);
        return false;  // Prevent navigation to the protected route
      }
    } catch (error) {
      console.error('AuthGuard: Error during authentication check:', error);
      // Redirect to login if there's an error
      this.router.navigate(['/login']);
      return false;
    }
  }
}
