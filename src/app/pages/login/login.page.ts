import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  confirmPassword: string = ''; 
  name: string = '';  
  errorMessage: string = '';
  authMode: 'login' | 'signup' = 'login'; 
  passwordVisible: boolean = false; 

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    this.clearErrorMessage();

    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields!';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response: { message: string; user: any }) => {
        console.log('Login successful!', response);
        this.router.navigate(['/home']);
      },
      error: (error: { message: string }) => {
        console.error('Login error', error);
        this.errorMessage = 'Incorrect email or password!';
      }
    });
  }

  onSignUp() {
    this.clearErrorMessage();

    if (!this.email || !this.password || !this.name || this.password !== this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields correctly!';
      return;
    }

    this.authService.register(this.name, this.email, this.password).subscribe({
      next: (response: { message: string; user: any }) => {
        console.log('Signup successful!', response);
        this.router.navigate(['/home']);
      },
      error: (error: { message: string }) => {
        console.error('Signup error', error);
        this.errorMessage = 'Error during registration. Please try again.';
      }
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  private clearErrorMessage() {
    this.errorMessage = '';
  }
}
