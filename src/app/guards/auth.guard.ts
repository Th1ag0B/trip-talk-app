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

      if (authResponse?.isAuthenticated) {
        console.log('AuthGuard: User is authenticated.');
        return true;  
      } else {
        console.log('AuthGuard: User is not authenticated. Redirecting to login.');
        this.router.navigate(['/login']);
        return false;  
      }
    } catch (error) {
      console.error('AuthGuard: Error during authentication check:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
