import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  authMode: string = 'login';

  constructor(private router: Router) {}

  onLogin() {
    this.clearErrorMessage();

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos!';
      return;
    }

    if (this.isValidUser(this.email, this.password)) {
      console.log('Login bem-sucedido!');
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Email ou password incorretos!';
    }
  }

  onSignUp() {
    this.clearErrorMessage();
    console.log('Funcionalidade de registo ainda não implementada.');
  }

  private isValidUser(email: string, password: string): boolean {
    const predefinedEmail = 'tobi@gmail.com';
    const predefinedPassword = '123';

    return email === predefinedEmail && password === predefinedPassword;
  }

  private clearErrorMessage() {
    this.errorMessage = '';
  }
}
